import 'reflect-metadata';
import Express from 'express';
import { config } from 'dotenv';
import BullBoard from 'bull-board';
import { ApolloServer, Config } from 'apollo-server-express';

import { defaults, logger } from '~/utils/globalMethods';
import { createTypeormConn } from '~/utils/typeORMConn';
import createSchema from '~/utils/createSchema';
import Queue from '~/utils/Queue';

(async (): Promise<void> => {
  config();
  const { RUN_PLAYGROUND, APP_NAME, ENVIRONMENT } = defaults;
  const { PORT } = process.env;
  const HttpPort = PORT || 3333;

  BullBoard.setQueues(Queue.queues.map(queue => queue.bull));
  logger.debug(`Starting ${APP_NAME} Server`);
  await createTypeormConn();

  const apolloServerConfig: Config = {
    schema: await createSchema(),
    cacheControl: { defaultMaxAge: 30 },
    playground: RUN_PLAYGROUND ? { title: APP_NAME, workspaceName: ENVIRONMENT } : false,
    formatError: error => {
      const { message, path } = error;
      logger.error(`Message: ${message.toUpperCase()} / On Path: ${JSON.stringify(path)}`);
      return error;
    },
    context: ({ req, res }: any) => ({ req, res }),
  };

  if (ENVIRONMENT === 'production') {
    apolloServerConfig.introspection = true;
  }

  const apolloServer = new ApolloServer(apolloServerConfig);
  const server = Express();

  apolloServer.applyMiddleware({
    app: server,
    cors: false,
  });

  server.use('/admin/queues', BullBoard.UI);

  server.get('/', (_, res) => res.json({ message: `${defaults.APP_NAME} is Running` }));

  server.listen(HttpPort, () => {
    logger.debug(`${APP_NAME} has started | PORT: ${HttpPort}`);
  });
})();
