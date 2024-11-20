import Comment, { IComment } from '../models/Comment';
import mongoose from 'mongoose';

interface CommentInput {
  content: string;
  author: string;
  parentComment?: string | null;
}

class CommentService {
  public async create(commentInput: CommentInput): Promise<IComment> {
    try {
      const comment = await Comment.create({
        content: commentInput.content,
        author: new mongoose.Types.ObjectId(commentInput.author),
        parentComment: commentInput.parentComment 
          ? new mongoose.Types.ObjectId(commentInput.parentComment)
          : null,
        reactions: []
      });
      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<IComment | null> {
    try {
      return await Comment.findById(id).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<IComment[]> {
    try {
      return await Comment.find().populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, commentInput: Partial<CommentInput>): Promise<IComment | null> {
    try {
      const updateData = {
        ...commentInput,
        parentComment: commentInput.parentComment
          ? new mongoose.Types.ObjectId(commentInput.parentComment)
          : null,
      };
      return await Comment.findByIdAndUpdate(id, updateData, { new: true })
        .populate('author')
        .populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string, userId: string): Promise<IComment | null> {
    try {
      return await Comment.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  public async addReaction(commentId: string, reaction: { type: 'like' | 'love' | 'disagree', user: string }): Promise<IComment | null> {
    try {
      return await Comment.findByIdAndUpdate(
        commentId,
        { $push: { reactions: { ...reaction, user: new mongoose.Types.ObjectId(reaction.user) } } },
        { new: true }
      ).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async removeReaction(commentId: string, userId: string): Promise<IComment | null> {
    try {
      return await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { reactions: { user: new mongoose.Types.ObjectId(userId) } } },
        { new: true }
      ).populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId: string) {
    return await Comment.find({ userId });
  }
}

export default new CommentService();