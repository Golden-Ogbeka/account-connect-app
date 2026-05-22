import { updateAccountService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const accountMutations = {
  updateAccount: async (
    _: unknown,
    { address, description }: { address?: string; description?: string },
    context: GraphQLContext,
  ) => {
    const user = requireAuth(context);
    return updateAccountService(user.id, { address, description });
  },
};
