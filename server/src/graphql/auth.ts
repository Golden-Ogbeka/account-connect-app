import { User } from '../types';
import { unauthenticatedError } from './errors';

export const requireAuth = (context: { user?: User | null }): User => {
  if (!context?.user) throw unauthenticatedError();
  return context.user;
};
