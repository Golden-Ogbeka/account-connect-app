import { accountTypeDefs } from './account';
import { connectionTypeDefs } from './connection';
import { sharedTypeDefs } from './shared';
import { transactionTypeDefs } from './transaction';
import { userTypeDefs } from './user';

export const typeDefs = [
  sharedTypeDefs,
  userTypeDefs,
  accountTypeDefs,
  transactionTypeDefs,
  connectionTypeDefs,
];
