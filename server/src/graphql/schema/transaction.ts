import { gql } from 'graphql-tag';

export const transactionTypeDefs = gql`
  enum TransactionStatus {
    pending
    posted
    reversed
  }

  type Transaction {
    id: ID!
    date: String!
    merchant: String!
    amount: Int!
    status: TransactionStatus!
  }

  type TransactionEdge {
    cursor: String!
    transaction: Transaction!
  }

  type TransactionConnection {
    items: [TransactionEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    transactions(status: TransactionStatus, limit: Int, after: String): TransactionConnection!
  }

  extend type Mutation {
    createTransaction(merchant: String!, amount: Int!, idempotencyKey: String!): Transaction!
    reverseTransaction(id: ID!): Transaction!
  }
`;
