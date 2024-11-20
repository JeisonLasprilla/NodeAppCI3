import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId;
    replies?: mongoose.Types.ObjectId[];
    reactions: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Reaction'
    }]
}, {
    timestamps: true
});

// Pre-save middleware para manejar las respuestas
CommentSchema.pre('save', async function(next) {
    if (this.isNew && this.parentComment) {
        const parentComment = await this.model('Comment').findById(this.parentComment) as IComment;
        if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(this._id);
            await parentComment.save();
        }
    }
    next();
});

export default mongoose.model<IComment>('Comment', CommentSchema);
