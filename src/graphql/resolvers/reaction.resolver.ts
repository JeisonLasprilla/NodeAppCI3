import ReactionService from '../../services/Reaction.service';
import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { PubSub } from 'graphql-subscriptions';
import { ReactionType } from '../../models/Reaction';
import { withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const reactionService = ReactionService;

export const reactionResolvers = {
  Query: {
    commentReactions: async (_: any, { commentId }: { commentId: string }) => {
      return await reactionService.getReactionsByComment(commentId);
    },
    userReactions: async (_: any, { userId }: { userId: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return await reactionService.getReactionsByUser(userId);
    }
  },

  Mutation: {
    addReaction: async (
      _: any, 
      { input }: { input: { commentId: string; type: ReactionType } }, 
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const reaction = await reactionService.addReaction(
        context.user.user_id,
        input.commentId,
        input.type
      );

      // Publicar el evento de reacción añadida
      pubsub.publish('REACTION_ADDED', {
        reactionAdded: {
          ...reaction.toObject(),
          commentId: input.commentId
        }
      });

      return reaction;
    },

    removeReaction: async (
      _: any, 
      { commentId }: { commentId: string }, 
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      await reactionService.removeReaction(context.user.user_id, commentId);
      
      // Publicar el evento de reacción eliminada
      pubsub.publish('REACTION_REMOVED', {
        reactionRemoved: {
          userId: context.user.user_id,
          commentId
        }
      });

      return true;
    }
  },

  Subscription: {
    reactionAdded: {
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator('REACTION_ADDED'),
        (payload, variables) => {
          return payload.reactionAdded.commentId === variables.commentId;
        }
      )
    },
    
    reactionRemoved: {
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator('REACTION_REMOVED'),
        (payload, variables) => {
          return payload.reactionRemoved.commentId === variables.commentId;
        }
      )
    }
  },

  // Field Resolvers
  Reaction: {
    user: async (parent: any, _: any, { dataSources }: any) => {
      // Asumiendo que tienes un servicio de usuarios
      return await dataSources.userService.findById(parent.user);
    },
    
    comment: async (parent: any, _: any, { dataSources }: any) => {
      // Asumiendo que tienes un servicio de comentarios
      return await dataSources.commentService.findById(parent.comment);
    }
  }
};