import { userResolvers } from './user.resolver';
import { commentResolvers } from './comment.resolver';
import { reactionResolvers } from './reaction.resolver';

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
      return await dataSources.userService.findById(parent.author);
    },
    reactions: async (parent: any, _: any, { dataSources }: any) => {
      return await dataSources.reactionService.getReactionsByComment(parent.id);
    }
  },

  Reaction: reactionResolvers.Reaction
};
