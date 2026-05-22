import { GraphQLError } from 'graphql';
import logger from '../utils/logger';

export const unauthenticatedError = () =>
  new GraphQLError('A valid JWT token is required.', {
    extensions: { code: 'UNAUTHENTICATED' },
  });

export const invalidCredentialsError = () =>
  new GraphQLError('Email or password is incorrect.', {
    extensions: { code: 'INVALID_CREDENTIALS' },
  });

export const forbiddenError = (message = 'You do not have permission to perform this action.') =>
  new GraphQLError(message, { extensions: { code: 'FORBIDDEN' } });

export const notFoundError = (message = 'Resource not found.') =>
  new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });

export const badRequestError = (message: string) =>
  new GraphQLError(message, { extensions: { code: 'BAD_REQUEST' } });

export const internalError = (cause?: unknown) => {
  if (cause) logger.error(`Internal error: ${cause instanceof Error ? cause.stack : cause}`);
  return new GraphQLError('An unexpected error occurred.', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  });
};
