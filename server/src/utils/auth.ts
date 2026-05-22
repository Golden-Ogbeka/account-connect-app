import jwt from 'jsonwebtoken';
import { config } from '../config';
import { getUserByIdService } from '../services/authService';
import { User } from '../types';

const jwtSecret = config.jwtSecret;

export const signToken = (user: User): string =>
  jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, jwtSecret) as { userId: string };
  } catch {
    return null;
  }
};

export const getUserFromHeader = async (authorization?: string): Promise<User | null> => {
  if (!authorization) return null;
  const token = authorization.replace('Bearer ', '').trim();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.userId) return null;
  try {
    return await getUserByIdService(payload.userId);
  } catch {
    return null;
  }
};
