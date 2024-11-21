import CommentService from '../../services/Comment.service';
import { GraphQLError } from 'graphql';
import { Context } from '../context';

const commentService = CommentService;

export const commentResolvers = {
  Query: {
    // Obtener todos los comentarios
    comments: async (_: any, __: any, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await commentService.findAll();
    },

    // Obtener un comentario por ID
    comment: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await commentService.findById(id);
    },

    // Obtener comentarios de un usuario
    userComments: async (_: any, { userId }: { userId: string }, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await commentService.findByUser(userId);
    }
  },

  Mutation: {
    // Crear comentario
    createComment: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        // Extraer el ID del usuario de manera más simple
        const authorId = context.user.user_id.toString();

        const commentData = {
          content: input.content,
          author: authorId,
          parentComment: input.parentCommentId || null
        };

        console.log('Creating comment with data:', commentData);

        const comment = await commentService.create(commentData);
        
        context.pubsub.publish('COMMENT_ADDED', { 
          commentAdded: {
            ...comment.toObject(),
            author: await context.dataSources.userService.findById(authorId)
          }
        });
        
        return comment;
      } catch (error) {
        console.error('Error creating comment:', error);
        throw new GraphQLError('Error al crear el comentario', {
          extensions: { code: 'COMMENT_CREATE_ERROR', originalError: error }
        });
      }
    },

    // Actualizar comentario
    updateComment: async (_: any, { id, content }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const comment = await commentService.update(
          id, 
          { content },
          context.user.user_id,
          context.user.role
        );

        if (!comment) {
          throw new GraphQLError('No se pudo actualizar el comentario', {
            extensions: { code: 'UPDATE_ERROR' }
          });
        }

        return comment;
      } catch (error) {
        console.error('Error updating comment:', error);
        throw new GraphQLError('Error al actualizar el comentario', {
          extensions: { code: 'UPDATE_ERROR', originalError: error }
        });
      }
    },

    // Eliminar comentario
    deleteComment: async (_: any, { id }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      
      return await commentService.delete(
        id, 
        context.user.user_id,
        context.user.role
      );
    }
  },

  Subscription: {
    commentAdded: {
      subscribe: (_: any, __: any, { pubsub }: { pubsub: any }) => 
        pubsub.asyncIterator(['COMMENT_ADDED'])
    }
  },

  Comment: {
    id: (parent: any) => parent._id.toString(),
    parentComment: async (parent: any, _: any, { dataSources }: Context) => {
      if (!parent.parentComment) return null;
      const parentId = typeof parent.parentComment === 'string' 
        ? parent.parentComment 
        : parent.parentComment._id.toString();
      return await dataSources.commentService.findById(parentId);
    },
    author: async (parent: any, _: any, { dataSources }: Context) => {
      const authorId = typeof parent.author === 'string' 
        ? parent.author 
        : parent.author._id.toString();
      return await dataSources.userService.findById(authorId);
    }
  }
};
