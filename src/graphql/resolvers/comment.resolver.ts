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
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });

      const comment = await commentService.create({
        ...input,
        author: context.user.user_id
      });

      context.pubsub.publish('COMMENT_ADDED', { commentAdded: comment });
      return comment;
    },

    // Actualizar comentario
    updateComment: async (_: any, { id, content }: any, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await commentService.update(id, content);
    },

    // Eliminar comentario
    deleteComment: async (_: any, { id }: any, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await commentService.delete(id, context.user.user_id);
    }
  },

  Subscription: {
    commentAdded: {
      subscribe: (_: any, __: any, { pubsub }: { pubsub: any }) => 
        pubsub.asyncIterator(['COMMENT_ADDED'])
    }
  }
};
