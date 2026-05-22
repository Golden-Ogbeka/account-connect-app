import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client/core';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';
import { getToken, removeToken } from '../auth/storage';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL });

const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();
  operation.setContext({
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return forward(operation);
});

const errorLink = new ErrorLink(({ error }) => {
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
  ) {
    removeToken();
    window.location.href = '/login';
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transactions: {
            keyArgs: ['status'],
            merge(existing, incoming) {
              if (!existing) return incoming;
              return {
                ...incoming,
                items: [...(existing.items ?? []), ...(incoming.items ?? [])],
              };
            },
          },
        },
      },
    },
  }),
});
