import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    created_at: String
    isFollowing: Boolean
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    profile: User
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
  }
`;
