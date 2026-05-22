import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const PROFILE_QUERY = gql`
  query Profile {
    profile {
      id
      name
      email
    }
  }
`;

export const ACCOUNT_QUERY = gql`
  query Account {
    account {
      id
      account_number
      account_name
      balance
      address
      description
    }
  }
`;

export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation UpdateAccount($address: String, $description: String) {
    updateAccount(address: $address, description: $description) {
      id
      address
      description
    }
  }
`;

export const TRANSACTIONS_QUERY = gql`
  query Transactions($status: TransactionStatus, $limit: Int, $after: String) {
    transactions(status: $status, limit: $limit, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      items {
        cursor
        transaction {
          id
          date
          merchant
          amount
          status
        }
      }
    }
  }
`;

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($merchant: String!, $amount: Int!, $idempotencyKey: String!) {
    createTransaction(merchant: $merchant, amount: $amount, idempotencyKey: $idempotencyKey) {
      id
      merchant
      amount
      status
      date
    }
  }
`;

export const REVERSE_TRANSACTION_MUTATION = gql`
  mutation ReverseTransaction($id: ID!) {
    reverseTransaction(id: $id) {
      id
      status
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      isFollowing
    }
  }
`;

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      email
      isFollowing
    }
  }
`;

export const FOLLOWING_QUERY = gql`
  query Following {
    following {
      id
      name
      email
      isFollowing
    }
  }
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      isFollowing
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId)
  }
`;
