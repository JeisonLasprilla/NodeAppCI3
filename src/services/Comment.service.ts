import Comment, { CommentDocument, CommentInput } from "../models/comment.module";
import mongoose from "mongoose";

class CommentService {
  public async create(commentInput: CommentInput): Promise<CommentDocument> {
    try {
      const comment = await Comment.create({
        ...commentInput,
        author: new mongoose.Types.ObjectId(commentInput.author),
        parentComment: commentInput.parentComment
          ? new mongoose.Types.ObjectId(commentInput.parentComment)
          : undefined,
        reactions: commentInput.reactions?.map((r) => ({
          ...r,
          user: new mongoose.Types.ObjectId(r.user),
        })),
      });
      return comment;
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
      return await Comment.find().populate('author').populate('parentComment');
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, commentInput: Partial<CommentInput>): Promise<CommentDocument | null> {
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

  public async delete(id: string): Promise<CommentDocument | null> {
    try {
      return await Comment.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  public async addReaction(commentId: string, reaction: { type: 'like' | 'love' | 'disagree', user: string }): Promise<CommentDocument | null> {
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

  public async removeReaction(commentId: string, userId: string): Promise<CommentDocument | null> {
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
}

export default new CommentService();