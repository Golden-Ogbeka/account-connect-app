import colors from 'colors/safe';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

const graphqlLogger = (req: Request, res: Response, next: NextFunction) => {
  const operationName = req.body?.operationName || 'anonymous';
  const operationType = req.body?.query?.trimStart().startsWith('mutation') ? 'mutation' : 'query';

  const label =
    operationType === 'mutation'
      ? colors.yellow(`GraphQL mutation: ${operationName}`)
      : colors.green(`GraphQL query: ${operationName}`);

  console.log(label);
  logger.info(`GraphQL ${operationType}: ${operationName}`);
  next();
};

export default graphqlLogger;
