import { getTransactionsService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const transactionQueries = {
  transactions: async (
    _: unknown,
    { status, limit, after }: { status?: string; limit?: number; after?: string },
    context: GraphQLContext,
  ) => {
    const user = requireAuth(context);
    return getTransactionsService(user.id, status, limit, after);
  },
};
