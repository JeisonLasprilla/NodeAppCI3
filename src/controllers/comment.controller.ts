import { Request, Response } from "express";
import { CommentSchema, CommentInputZod } from "../schemas/comment.schema";
import { ZodError } from "zod";
import CommentService from "../services/Comment.service";

class CommentController {
  public async create(req: Request, res: Response) {
    try {
      const commentInput: CommentInputZod = CommentSchema.parse({
        ...req.body,
        author: req.user!.user_id, // Asumiendo que el usuario autenticado es el autor
        reactions: [] // Inicializamos las reacciones como un array vacío
      });
      const comment = await CommentService.create(commentInput);
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
      const comment = await CommentService.findById(req.params.id);
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
      const comments = await CommentService.findAll();
      res.json(comments);
    } catch (error) {
      console.error("Error fetching all comments:", error);
      res.status(500).json({ message: "Error fetching all comments", error: error });
    }
  }

  public async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commentInput = CommentSchema.partial().parse(req.body);
      const updatedComment = await CommentService.update(id, commentInput);
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Error updating comment", error: error });
    }
  }

  public async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;
      const deletedComment = await CommentService.delete(id, userId);
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment", error: error });
    }
  }

  public async addReaction(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { type } = req.body;
      const userId = req.user!.user_id;
      const updatedComment = await CommentService.addReaction(commentId, { type, user: userId });
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ message: "Error adding reaction", error: error });
    }
  }

  public async removeReaction(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.user!.user_id;
      const updatedComment = await CommentService.removeReaction(commentId, userId);
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      console.error("Error removing reaction:", error);
      res.status(500).json({ message: "Error removing reaction", error: error });
    }
  }

}

export default new CommentController();