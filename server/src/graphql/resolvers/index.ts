import { accountMutations, authMutations, connectionMutations, transactionMutations } from './mutations';
import { accountQueries, connectionQueries, transactionQueries, userQueries } from './queries';

export const resolvers = {
  Query: {
    ...userQueries,
    ...accountQueries,
    ...transactionQueries,
    ...connectionQueries,
  },
  Mutation: {
    ...authMutations,
    ...accountMutations,
    ...transactionMutations,
    ...connectionMutations,
  },
};
