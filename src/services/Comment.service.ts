import Comment, { IComment } from '../models/Comment';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

interface CommentInput {
  content: string;
  author: string;
  parentComment?: string | null;
}

class CommentService {
  public async create(commentInput: CommentInput): Promise<IComment> {
    try {
      console.log('Received comment input:', commentInput); // Debug log

      const commentData = {
        content: commentInput.content,
        author: new mongoose.Types.ObjectId(commentInput.author),
        parentComment: commentInput.parentComment 
          ? new mongoose.Types.ObjectId(commentInput.parentComment)
          : null,
        reactions: []
      };

      console.log('Processed comment data:', commentData); // Debug log

      const comment = await Comment.create(commentData);
      
      const populatedComment = await Comment.findById(comment._id)
        .populate('author')
        .populate('parentComment')
        .populate('replies');

      if (!populatedComment) {
        throw new Error('Error al crear el comentario');
      }

      return populatedComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      if (error instanceof mongoose.Error.CastError) {
        throw new Error(`Error al convertir ID: ${error.value} no es un ID válido`);
      }
      throw error;
    }
  }

  public async findById(id: string): Promise<IComment | null> {
    try {
      return await Comment.findById(id)
        .populate('author')
        .populate('parentComment')
        .populate('replies');
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<IComment[]> {
    try {
      const comments = await Comment.find()
        .populate({
          path: 'author',
          model: 'User'
        })
        .populate('parentComment')
        .populate('reactions')
        .sort({ createdAt: -1 });

      // Filtrar comentarios que no tienen autor
      return comments.filter(comment => comment.author);
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  public async update(
    id: string, 
    commentInput: Partial<CommentInput>,
    userId: string,
    userRole: string
  ): Promise<IComment | null> {
    try {
      // Verificar si el comentario existe
      const comment = await Comment.findById(id);
      if (!comment) {
        throw new Error('Comentario no encontrado');
      }

      // Verificar permisos
      if (userRole !== 'superadmin' && comment.author.toString() !== userId) {
        throw new Error('No autorizado para actualizar este comentario');
      }

      // Actualizar el comentario
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { ...commentInput },
        { new: true }
      )
      .populate('author')
      .populate('parentComment')
      .populate('replies');

      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  public async delete(id: string, userId: string, userRole: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }

      // Si es superadmin, puede borrar cualquier comentario
      if (userRole === 'superadmin') {
        const result = await Comment.findByIdAndDelete(id);
        return result !== null;
      }

      // Si no es superadmin, solo puede borrar sus propios comentarios
      const comment = await Comment.findOne({
        _id: id,
        author: new mongoose.Types.ObjectId(userId)
      });

      if (!comment) {
        return false;
      }

      const result = await Comment.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
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