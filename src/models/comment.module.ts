import mongoose from "mongoose";

export interface CommentInput {
  content: string;
  author: string;
  parentComment?: string | null;
  reactions: {
    type: 'like' | 'love' | 'disagree';
    user: string;
  }[];
}

export interface CommentDocument extends CommentInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  reactions: [{
    type: { type: String, enum: ['like', 'love', 'disagree'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;