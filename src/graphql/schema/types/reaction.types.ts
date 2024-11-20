export const reactionTypes = `#graphql
  type Reaction {
    id: ID!
    type: ReactionType!
    user: User!
    comment: Comment!
    createdAt: String!
    updatedAt: String!
  }

  enum ReactionType {
    LIKE
    LOVE
    HAHA
    WOW
    SAD
    ANGRY
  }

  input CreateReactionInput {
    commentId: ID!
    type: ReactionType!
  }

  type ReactionRemovedPayload {
    userId: ID!
    commentId: ID!
  }
`;
