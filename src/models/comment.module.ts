import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  reactions: {
    type: 'like' | 'love' | 'disagree';
    user: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  reactions: [{
    type: { type: String, enum: ['like', 'love', 'disagree'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema);