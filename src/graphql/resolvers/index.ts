import { userResolvers } from './user.resolver';
import { commentResolvers } from './comment.resolver';
import { reactionResolvers } from './reaction.resolver';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    me: userResolvers.Query.me,
    users: userResolvers.Query.users,
    user: userResolvers.Query.user,
    comments: commentResolvers.Query.comments,
    comment: commentResolvers.Query.comment,
    userComments: commentResolvers.Query.comments,
    commentReactions: reactionResolvers.Query.commentReactions,
    userReactions: reactionResolvers.Query.userReactions
  },

  Mutation: {
    register: userResolvers.Mutation.register,
    login: userResolvers.Mutation.login,
    deleteUser: userResolvers.Mutation.deleteUser,
    updateUser: userResolvers.Mutation.updateUser,
    createComment: commentResolvers.Mutation.createComment,
    updateComment: commentResolvers.Mutation.updateComment,
    deleteComment: commentResolvers.Mutation.deleteComment,
    addReaction: reactionResolvers.Mutation.addReaction,
    removeReaction: reactionResolvers.Mutation.removeReaction
  },

  Subscription: {
    commentAdded: commentResolvers.Subscription.commentAdded,
    reactionAdded: reactionResolvers.Subscription.reactionAdded,
    reactionRemoved: reactionResolvers.Subscription.reactionRemoved
  },

  User: {
    comments: async (parent: any, _: any, { dataSources }: any) => {
      return await dataSources.commentService.findByUser(parent.id);
    }
  },

  Comment: {
    author: async (parent: any, _: any, { dataSources }: any) => {
      if (!parent.author) {
        throw new GraphQLError('Autor no encontrado', {
          extensions: { code: 'AUTHOR_NOT_FOUND' }
        });
      }
      
      const authorId = typeof parent.author === 'string' 
        ? parent.author 
        : parent.author._id || parent.author.toString();
      
      const author = await dataSources.userService.findById(authorId);
      if (!author) {
        throw new GraphQLError('Autor no encontrado', {
          extensions: { code: 'AUTHOR_NOT_FOUND' }
        });
      }
      
      return author;
    },
    reactions: async (parent: any, _: any, { dataSources }: any) => {
      return await dataSources.reactionService.getReactionsByComment(parent.id);
    }
  },

  Reaction: reactionResolvers.Reaction
};
