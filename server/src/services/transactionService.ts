import { v4 as uuidv4 } from 'uuid';
import db, { sql } from '../db';
import { badRequestError, internalError, notFoundError } from '../graphql/errors';
import { PageInfo, Transaction, TransactionConnection, TransactionEdge } from '../types';
import { updateAccountBalanceService } from './accountService';

const toCursor = (id: string): string => Buffer.from(id).toString('base64');
const fromCursor = (cursor: string): string => Buffer.from(cursor, 'base64').toString('utf-8');

export const getTransactionsService = async (
  userId: string,
  status?: string,
  limit?: number,
  after?: string,
): Promise<TransactionConnection> => {
  try {
    let transactions = (await db.query(
      status
        ? sql`SELECT * FROM transactions WHERE user_id = ${userId} AND status = ${status} ORDER BY date DESC`
        : sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY date DESC`,
    )) as Transaction[];

    const totalCount = transactions.length;

    if (after) {
      const afterId = fromCursor(after);
      const idx = transactions.findIndex((tx) => tx.id === afterId);
      if (idx !== -1) transactions = transactions.slice(idx + 1);
    }

    if (limit) transactions = transactions.slice(0, limit + 1);
    const hasNextPage = limit ? transactions.length > limit : false;
    if (hasNextPage) transactions = transactions.slice(0, limit);

    const items: TransactionEdge[] = transactions.map((tx) => ({
      cursor: toCursor(tx.id),
      transaction: tx,
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      hasPreviousPage: !!after,
      startCursor: items.length > 0 ? items[0].cursor : null,
      endCursor: items.length > 0 ? items[items.length - 1].cursor : null,
    };

    return { items, pageInfo, totalCount };
  } catch (error) {
    throw internalError(error);
  }
};

export const createTransactionService = async (
  merchant: string,
  amount: number,
  userId: string,
  accountId: string,
  idempotencyKey: string,
): Promise<{ transaction: Transaction; isNew: boolean }> => {
  try {
    const existing = await db.query(
      sql`SELECT * FROM transactions WHERE idempotency_key = ${idempotencyKey} AND user_id = ${userId}`,
    );
    if (existing[0]) return { transaction: existing[0] as Transaction, isNew: false };

    const id = uuidv4();
    const date = new Date().toISOString();

    await db.query(
      sql`INSERT INTO transactions (id, account_id, user_id, merchant, amount, status, idempotency_key, date)
          VALUES (${id}, ${accountId}, ${userId}, ${merchant}, ${amount}, ${'pending'}, ${idempotencyKey}, ${date})`,
    );

    const rows = await db.query(sql`SELECT * FROM transactions WHERE id = ${id}`);
    return { transaction: rows[0] as Transaction, isNew: true };
  } catch (error) {
    throw internalError(error);
  }
};

export const postTransactionService = async (id: string): Promise<Transaction> => {
  try {
    const rows = await db.query(sql`SELECT * FROM transactions WHERE id = ${id}`);
    const transaction = rows[0] as Transaction | undefined;
    if (!transaction) throw notFoundError('Transaction not found.');
    if (transaction.status !== 'pending') return transaction;

    await db.query(sql`UPDATE transactions SET status = 'posted' WHERE id = ${id}`);
    await updateAccountBalanceService(transaction.account_id, transaction.amount);

    return { ...transaction, status: 'posted' };
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};

export const reverseTransactionService = async (
  id: string,
  userId: string,
): Promise<Transaction> => {
  try {
    const rows = await db.query(
      sql`SELECT * FROM transactions WHERE id = ${id} AND user_id = ${userId}`,
    );
    const transaction = rows[0] as Transaction | undefined;
    if (!transaction) throw notFoundError('Transaction not found.');

    const statusMessages: Record<string, string> = {
      pending: 'This transaction is still pending and cannot be reversed.',
      reversed: 'This transaction has already been reversed.',
    };
    if (transaction.status !== 'posted')
      throw badRequestError(
        statusMessages[transaction.status] ?? 'This transaction cannot be reversed.',
      );

    await db.query(sql`UPDATE transactions SET status = 'reversed' WHERE id = ${id}`);
    await updateAccountBalanceService(transaction.account_id, -transaction.amount);

    return { ...transaction, status: 'reversed' };
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};
