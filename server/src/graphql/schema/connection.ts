import { gql } from 'graphql-tag';

export const connectionTypeDefs = gql`
  extend type Query {
    following: [User!]!
  }

  extend type Mutation {
    followUser(userId: ID!): User!
    unfollowUser(userId: ID!): Boolean!
  }
`;
