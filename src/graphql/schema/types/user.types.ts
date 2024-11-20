export const userTypes = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    comments: [Comment!]
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;