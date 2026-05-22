import { gql } from 'graphql-tag';

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    account_number: String!
    account_name: String!
    balance: Int!
    address: String
    description: String
    created_at: String
  }

  extend type Query {
    account: Account!
  }

  extend type Mutation {
    updateAccount(address: String, description: String): Account!
  }
`;
