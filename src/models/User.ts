import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'regular' | 'superadmin';
    comments?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserInput {
    email: string;
    password: string;
    name: string;
    role?: string;
}

export interface UserDocument extends Document {
    email: string;
    password: string;
    name: string;
    role: string;
    // ... otros campos necesarios
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['regular', 'superadmin'],
        default: 'regular'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error as Error);
    }
});

export default mongoose.model<IUser>('User', UserSchema);
