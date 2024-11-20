import mongoose, { Schema, Document } from 'mongoose';

export enum ReactionType {
    LIKE = 'LIKE',
    LOVE = 'LOVE',
    HAHA = 'HAHA',
    WOW = 'WOW',
    SAD = 'SAD',
    ANGRY = 'ANGRY'
}

export interface IReaction extends Document {
    type: ReactionType;
    user: mongoose.Types.ObjectId;
    comment: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ReactionSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(ReactionType),
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IReaction>('Reaction', ReactionSchema);
