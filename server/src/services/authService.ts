import db, { sql } from '../db';
import { internalError, invalidCredentialsError, notFoundError } from '../graphql/errors';
import { User } from '../types';

export const getUserByEmailService = async (email: string): Promise<User | null> => {
  try {
    const rows = await db.query(sql`SELECT * FROM users WHERE email = ${email}`);
    return (rows[0] as User) ?? null;
  } catch (error) {
    throw internalError(error);
  }
};

export const getUserByIdService = async (id: string): Promise<User> => {
  try {
    const rows = await db.query(sql`SELECT * FROM users WHERE id = ${id}`);
    if (!rows[0]) throw notFoundError('User not found.');
    return rows[0] as User;
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};

export const getAllUsersService = async (excludeUserId: string): Promise<User[]> => {
  try {
    return (await db.query(
      sql`SELECT id, name, email, created_at FROM users WHERE id != ${excludeUserId}`,
    )) as User[];
  } catch (error) {
    throw internalError(error);
  }
};

export const authenticateUserService = async (email: string, password: string): Promise<User> => {
  const user = await getUserByEmailService(email);
  if (!user || user.password !== password) throw invalidCredentialsError();
  return user;
};
