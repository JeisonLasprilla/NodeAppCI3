import Comment, { CommentDocument, CommentInput } from "../models/comment.module";
import mongoose from 'mongoose';

class CommentService {
  public async create(commentInput: CommentInput): Promise<CommentDocument> {
    try {
      const comment = new Comment(commentInput);
      return await comment.save();
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<CommentDocument | null> {
    try {
      return await Comment.findById(id).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<CommentDocument[]> {
    try {
      const comments = await Comment.find().populate('author').populate('parentComment');
      if (comments.length === 0) {
        throw new Error('No comments found');
      }
      return comments;
    } catch (error) {
      throw error;
    }
  }

  public async addReaction(commentId: string, reaction: { type: 'like' | 'love' | 'disagree', user: mongoose.Types.ObjectId }): Promise<CommentDocument | null> {
    try {
      return await Comment.findByIdAndUpdate(
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