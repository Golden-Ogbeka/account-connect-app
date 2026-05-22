import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { Request } from 'express';
import { config } from './config';
import { initDb } from './db';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema/index';
import { recoverJobs } from './jobs/transactionJobs';
import graphqlLogger from './middleware/logger';
import { getUserFromHeader } from './utils/auth';
import logger from './utils/logger';

async function startServer(): Promise<void> {
  await initDb();

  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use(express.json());
  app.use(cors({ origin: config.corsList, credentials: true }));
  app.use(graphqlLogger);
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const user = await getUserFromHeader(req.headers.authorization as string | undefined);
        return { user };
      },
    }),
  );

  app.listen(config.port, () => {
    logger.info(`Server running at ${config.appUrl}:${config.port}/graphql`);
    void recoverJobs();
  });

  const shutdown = () => server.stop().then(() => process.exit(0));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((error) => {
  logger.error(`Error starting server: ${error instanceof Error ? error.stack : error}`);
  process.exit(1);
});
