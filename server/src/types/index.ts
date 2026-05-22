export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_name: string;
  balance: number; // in kobo
  address?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  user_id: string;
  merchant: string;
  amount: number; // in kobo
  status: 'pending' | 'posted' | 'reversed';
  idempotency_key: string;
  date: string;
}

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface AuthPayload {
  token: string;
  user: Omit<User, 'password'>;
}

export interface GraphQLContext {
  user?: User | null;
}

export interface TransactionEdge {
  cursor: string;
  transaction: Transaction;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface TransactionConnection {
  items: TransactionEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}
