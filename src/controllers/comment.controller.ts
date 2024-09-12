import { Request, Response } from 'express';
import Comment from '../models/comment.module';
import mongoose from 'mongoose';

const CommentController = {
  async getAll(req: Request, res: Response) {
    try {
      const comments = await Comment.find().populate('author', 'name');
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments", error });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { content, parentComment } = req.body;
      const comment = new Comment({
        content,
        author: "jeison", //req.body.loggedUser.user_id,
        parentComment
      });
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Error creating comment", error });
    }
  },

  async getComment(req: Request, res: Response) {
    try {
      const comment = await Comment.findById(req.params.id).populate('author', 'name');
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comment", error });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.author.toString() !== req.body.loggedUser.user_id) {
        return res.status(403).json({ message: "Not authorized to update this comment" });
      }
      comment.content = req.body.content;
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Error updating comment", error });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.author.toString() !== req.body.loggedUser.user_id) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
      await comment.deleteOne();
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error });
    }
  },

  async reply(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const parentComment = await Comment.findById(req.params.id);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      const reply = new Comment({
        content,
        author: req.body.loggedUser.user_id,
        parentComment: parentComment._id
      });
      await reply.save();
      res.status(201).json(reply);
    } catch (error) {
      res.status(400).json({ message: "Error creating reply", error });
    }
  },

  async react(req: Request, res: Response) {
    try {
      const { type } = req.body;
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      const existingReaction = comment.reactions.find(
        (r: { user: mongoose.Types.ObjectId; type: string }) => r.user.toString() === req.body.loggedUser.user_id
      );
      if (existingReaction) {
        existingReaction.type = type;
      } else {
        comment.reactions.push({ type, user: req.body.loggedUser.user_id });
      }
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Error reacting to comment", error });
    }
  },

  async removeReaction(req: Request, res: Response) {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      comment.reactions = comment.reactions.filter(
        (r: { user: mongoose.Types.ObjectId }) => r.user.toString() !== req.body.loggedUser.user_id
      );
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Error removing reaction", error });
    }
  }
};

export default CommentController;