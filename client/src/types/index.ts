export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  isFollowing?: boolean;
}

export interface Account {
  id: string;
  account_number: string;
  account_name: string;
  balance: number;
  address?: string | null;
  description?: string | null;
  created_at?: string;
}

export type TransactionStatus = 'pending' | 'posted' | 'reversed';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  status: TransactionStatus;
}

export interface TransactionEdge {
  cursor: string;
  transaction: Transaction;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface TransactionConnection {
  items: TransactionEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface AuthPayload {
  token: string;
  user: User;
}
