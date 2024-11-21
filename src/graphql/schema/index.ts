import { userTypes } from './types/user.types';
import { commentTypes } from './types/comment.types';
import { reactionTypes } from './types/reaction.types';

export const typeDefs = `#graphql
  directive @auth(requires: [Role!]!) on FIELD_DEFINITION

  enum Role {
    superadmin
    regular
  }

  ${userTypes}
  ${commentTypes}
  ${reactionTypes}

  type Query {
    # User queries
    me: User @auth(requires: [regular, superadmin])
    users: [User!]! @auth(requires: [superadmin])
    user(id: ID!): User @auth(requires: [regular, superadmin])

    # Comment queries
    comments: [Comment!]! @auth(requires: [regular, superadmin])
    comment(id: ID!): Comment @auth(requires: [regular, superadmin])
    userComments(userId: ID!): [Comment!]! @auth(requires: [regular, superadmin])

    # Reaction queries
    commentReactions(commentId: ID!): [Reaction!]! @auth(requires: [regular, superadmin])
    userReactions(userId: ID!): [Reaction!]! @auth(requires: [regular, superadmin])
  }

  type Mutation {
    # User mutations
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    deleteUser(id: ID!): Boolean! @auth(requires: [superadmin])
    updateUser(id: ID!, input: UpdateUserInput!): User @auth(requires: [superadmin])

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment! @auth(requires: [regular, superadmin])
    updateComment(id: ID!, content: String!): Comment! @auth(requires: [regular, superadmin])
    deleteComment(id: ID!): Boolean! @auth(requires: [regular, superadmin])

    # Reaction mutations
    addReaction(input: CreateReactionInput!): Reaction! @auth(requires: [regular, superadmin])
    removeReaction(commentId: ID!): Boolean! @auth(requires: [regular, superadmin])
  }

  type Subscription {
    commentAdded: Comment!
    reactionAdded(commentId: ID!): Reaction!
    reactionRemoved(commentId: ID!): ReactionRemovedPayload!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String
    reactions: [Reaction]
  }

  input CommentInput {
    content: String!
  }
`;
