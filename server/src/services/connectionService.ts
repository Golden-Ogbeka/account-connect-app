import { v4 as uuidv4 } from 'uuid';
import db, { sql } from '../db';
import { badRequestError, internalError, notFoundError } from '../graphql/errors';
import { Connection, User } from '../types';

export const followUserService = async (
  followerId: string,
  followingId: string,
): Promise<Connection> => {
  if (followerId === followingId) throw badRequestError('You cannot follow yourself.');
  try {
    const target = await db.query(sql`SELECT id FROM users WHERE id = ${followingId}`);
    if (!target[0]) throw notFoundError('User not found.');

    const existing = await db.query(
      sql`SELECT * FROM connections WHERE follower_id = ${followerId} AND following_id = ${followingId}`,
    );
    if (existing[0]) return existing[0] as Connection;

    const id = uuidv4();
    await db.query(
      sql`INSERT INTO connections (id, follower_id, following_id) VALUES (${id}, ${followerId}, ${followingId})`,
    );
    const rows = await db.query(sql`SELECT * FROM connections WHERE id = ${id}`);
    return rows[0] as Connection;
  } catch (error) {
    if (error instanceof Error && 'extensions' in error) throw error;
    throw internalError(error);
  }
};

export const unfollowUserService = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  try {
    await db.query(
      sql`DELETE FROM connections WHERE follower_id = ${followerId} AND following_id = ${followingId}`,
    );
    return true;
  } catch (error) {
    throw internalError(error);
  }
};

export const getFollowingService = async (userId: string): Promise<User[]> => {
  try {
    return (await db.query(
      sql`SELECT u.id, u.name, u.email, u.created_at
          FROM users u
          INNER JOIN connections c ON c.following_id = u.id
          WHERE c.follower_id = ${userId}`,
    )) as User[];
  } catch (error) {
    throw internalError(error);
  }
};

export const isFollowingService = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  try {
    const rows = await db.query(
      sql`SELECT id FROM connections WHERE follower_id = ${followerId} AND following_id = ${followingId}`,
    );
    return rows.length > 0;
  } catch (error) {
    throw internalError(error);
  }
};
