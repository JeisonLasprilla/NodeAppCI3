export const commentTypes = `#graphql
  type Comment {
    id: ID!
    content: String!
    author: User!
    parentComment: Comment
    replies: [Comment!]
    reactions: [Reaction!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCommentInput {
    content: String!
    parentCommentId: ID
  }

  input UpdateCommentInput {
    content: String!
  }
`;
