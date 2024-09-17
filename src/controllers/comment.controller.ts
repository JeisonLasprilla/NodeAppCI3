import { Request, Response } from "express";
import Comment, { CommentDocument, CommentInput } from "../models/comment.module";
import { CommentSchema, CommentInputZod } from "../schemas/comment.schema";
import mongoose from 'mongoose';
import { ZodError } from "zod";

class CommentController {
  public async create(req: Request, res: Response) {
    try {
      const commentInput: CommentInputZod = CommentSchema.parse(req.body);
      const comment: CommentDocument = await Comment.create({
        ...commentInput,
        author: new mongoose.Types.ObjectId(commentInput.author),
        parentComment: commentInput.parentComment ? new mongoose.Types.ObjectId(commentInput.parentComment) : undefined,
        reactions: commentInput.reactions?.map(r => ({
          ...r,
          user: new mongoose.Types.ObjectId(r.user)
        }))
      });
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment", error: error });
    }
  }

  public async getComment(req: Request, res: Response) {
    try {
      const comment: CommentDocument | null = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({
          error: "not found",
          message: `Comment with id ${req.params.id} not found`,
        });
      }
      res.json(comment);
    } catch (error) {
      console.error("Error fetching comment:", error);
      res.status(500).json({ message: "Error fetching comment", error: error });
    }
  }

  public async getAllComments(req: Request, res: Response) {
    try {
      const comments: CommentDocument[] = await Comment.find();
      res.json(comments);
    } catch (error) {
      console.error("Error fetching all comments:", error);
      res.status(500).json({ message: "Error fetching all comments", error: error });
    }
  }

  public async addReaction(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { type, user } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $push: { reactions: { type, user } } },
        { new: true }
      );
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ message: "Error adding reaction", error: error });
    }
  }

  // Otros métodos como update, delete, etc.
}

export default new CommentController();