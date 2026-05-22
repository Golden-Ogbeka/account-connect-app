import db, { sql } from '../db';
import { badRequestError, internalError, notFoundError } from '../graphql/errors';
import { Account } from '../types';

export const getAccountByUserIdService = async (userId: string): Promise<Account> => {
  try {
    const rows = await db.query(sql`SELECT * FROM accounts WHERE user_id = ${userId}`);
    if (!rows[0]) throw notFoundError('Account not found.');
    return rows[0] as Account;
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};

export const updateAccountService = async (
  userId: string,
  fields: { address?: string; description?: string },
): Promise<Account> => {
  if (!fields.address && !fields.description)
    throw badRequestError('At least one field must be provided to update.');

  try {
    if (fields.address !== undefined)
      await db.query(sql`UPDATE accounts SET address = ${fields.address} WHERE user_id = ${userId}`);
    if (fields.description !== undefined)
      await db.query(sql`UPDATE accounts SET description = ${fields.description} WHERE user_id = ${userId}`);
    return getAccountByUserIdService(userId);
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};

export const updateAccountBalanceService = async (
  accountId: string,
  amountKobo: number,
): Promise<void> => {
  try {
    await db.query(
      sql`UPDATE accounts SET balance = balance + ${amountKobo} WHERE id = ${accountId}`,
    );
  } catch (error) {
    throw internalError(error);
  }
};
