import CommentModel, { IComment } from "../models/comment.module";
import mongoose from 'mongoose';

class CommentService {
  public async create(commentInput: Partial<IComment>): Promise<IComment> {
    try {
      const comment = new CommentModel(commentInput);
      await comment.save();
      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findById(id).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<IComment[]> {
    try {
      const comments = await CommentModel.find().populate('author').populate('parentComment');
      if (comments.length === 0) {
        throw new Error('404: No comments found');
      }
      return comments;
    } catch (error) {
        throw new Error('404 Not Found');
    }
  }
  
  

  public async addReaction(commentId: string, reaction: { type: 'like' | 'love' | 'disagree', user: mongoose.Types.ObjectId }): Promise<IComment | null> {
    try {
      return await CommentModel.findByIdAndUpdate(
        commentId,
        { $push: { reactions: reaction } },
        { new: true }
      ).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  // Otros métodos como update, delete, etc.
}

export default new CommentService();