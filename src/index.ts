import 'reflect-metadata';
import { config } from 'dotenv';
import { ApolloServer, Config } from 'apollo-server-express';
import Express from 'express';
import { createTypeormConn } from './utils/typeORMConn';
import createSchema from './utils/createSchema';
import { defaults, logger } from './utils/globalMethods';

(async (): Promise<void> => {
  config();
  const { RUN_PLAYGROUND, APP_NAME, ENVIRONMENT } = defaults;
  const { PORT } = process.env;
  const HttpPort = PORT || 3333;

  logger.debug(`Starting ${APP_NAME} Server`);

  await createTypeormConn();

  const apolloServerConfig: Config = {
    schema: await createSchema(),
    cacheControl: { defaultMaxAge: 30 },
    playground: RUN_PLAYGROUND ? { title: APP_NAME, workspaceName: ENVIRONMENT } : false,
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

  server.get('/', (_, res) => res.json({ message: `${defaults.APP_NAME} is Running` }));

  server.listen(HttpPort, () => {
    logger.debug(`${APP_NAME} has started | PORT: ${HttpPort}`);
  });
})();
