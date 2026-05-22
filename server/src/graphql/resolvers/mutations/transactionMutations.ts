import { schedulePostTransactionJob } from '../../../jobs/transactionJobs';
import { createTransactionService, getAccountByUserIdService, reverseTransactionService } from '../../../services';
import { GraphQLContext } from '../../../types';
import { requireAuth } from '../../auth';

export const transactionMutations = {
  createTransaction: async (
    _: unknown,
    { merchant, amount, idempotencyKey }: { merchant: string; amount: number; idempotencyKey: string },
    context: GraphQLContext,
  ) => {
    const user = requireAuth(context);
    const account = await getAccountByUserIdService(user.id);
    const { transaction, isNew } = await createTransactionService(merchant, amount, user.id, account.id, idempotencyKey);
    if (isNew) await schedulePostTransactionJob(transaction.id);
    return transaction;
  },
  reverseTransaction: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
    const user = requireAuth(context);
    return reverseTransactionService(id, user.id);
  },
};
