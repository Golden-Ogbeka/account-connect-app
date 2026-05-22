import { getAccountByUserIdService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const accountQueries = {
  account: async (_: unknown, __: unknown, context: GraphQLContext) => {
    const user = requireAuth(context);
    return getAccountByUserIdService(user.id);
  },
};
