import 'reflect-metadata';

import { ApolloServer, Config } from 'apollo-server-express';
import { router as BullRouter, setQueues } from 'bull-board';
import { config } from 'dotenv';
import Express from 'express';

import createSchema from './utils/createSchema';
import { defaults, logger } from './utils/globalMethods';
import Queue from './utils/Queue';
import { createTypeormConn } from './utils/typeORMConn';

(async (): Promise<void> => {
  config();
  const { APP_NAME, ENVIRONMENT, RUN_PLAYGROUND } = defaults;
  const { PORT } = process.env;
  const httpPort = PORT || 3333;

  logger.debug(`Starting ${APP_NAME} Server`);

  setQueues(Queue.queues.map((queue) => queue.bull));

  await createTypeormConn();

  const apolloServerConfig: Config = {
    cacheControl: { defaultMaxAge: 30 },
    context: ({ req, res }: any) => ({ req, res }),
    formatError: (error) => {
      const { message, path } = error;
      logger.error(
        `Message: ${message.toUpperCase()} / On Path: ${JSON.stringify(path)}`,
      );
      return error;
    },
    playground: RUN_PLAYGROUND
      ? { title: APP_NAME, workspaceName: ENVIRONMENT }
      : false,
    schema: await createSchema(),
  };

  if (ENVIRONMENT === 'production') {
    apolloServerConfig.introspection = true;
  }

  const apolloServer = new ApolloServer(apolloServerConfig);
  const server = Express();

  apolloServer.applyMiddleware({
    app: server,
    cors: true,
  });

  server.use('/admin/queues', BullRouter);

  server.get('/', (_, res) =>
    res.json({ message: `${defaults.APP_NAME} is Running` }),
  );

  server.listen(httpPort, () => {
    logger.debug(`${APP_NAME} has started | PORT: ${httpPort}`);
  });
})();
