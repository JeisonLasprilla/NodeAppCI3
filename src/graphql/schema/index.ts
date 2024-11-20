import { userTypes } from './types/user.types';
import { commentTypes } from './types/comment.types';
import { reactionTypes } from './types/reaction.types';

export const typeDefs = `#graphql
  ${userTypes}
  ${commentTypes}
  ${reactionTypes}

  type Query {
    # User queries
    me: User
    users: [User!]!
    user(id: ID!): User

    # Comment queries
    comments: [Comment!]!
    comment(id: ID!): Comment
    userComments(userId: ID!): [Comment!]!

    # Reaction queries
    commentReactions(commentId: ID!): [Reaction!]!
    userReactions(userId: ID!): [Reaction!]!
  }

  type Mutation {
    # User mutations
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!

    # Reaction mutations
    addReaction(input: CreateReactionInput!): Reaction!
    removeReaction(commentId: ID!): Boolean!
  }

  type Subscription {
    commentAdded: Comment!
    reactionAdded(commentId: ID!): Reaction!
    reactionRemoved(commentId: ID!): ReactionRemovedPayload!
  }
`;
