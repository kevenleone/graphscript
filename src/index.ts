import 'reflect-metadata';
import { config } from 'dotenv';
import { ApolloServer, Config } from 'apollo-server-express';
import Express from 'express';
import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import createSchema from './utils/createSchema';
import { defaults, logger } from './config/globalMethods';


(async () => {
  config();
  const { RUN_PLAYGROUND, APP_NAME } = defaults;
  const { NODE_ENV, PORT } = process.env;
  const HttpPort = PORT || 3333;
  const environment = NODE_ENV === "production" ? "production" : "default"; 
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    environment
    );
    
  logger.debug(`Starting ${APP_NAME} Server`);

  await createConnection({
    ...connectionOptions,
    name: "default"
  });

  const apolloServerConfig: Config = {
    schema: await createSchema(),
    playground: RUN_PLAYGROUND,
    context: ({ req, res }: any) => ({ req, res })
  };

  if (environment === "production") {
    apolloServerConfig.introspection = true;
  }

  const apolloServer = new ApolloServer(apolloServerConfig);
  const server = Express();

  apolloServer.applyMiddleware({
    app: server,
    cors: false
  });

  server.get('/', (_, response) =>  response.json({ hello: 'world' }))

  server.listen(HttpPort, () => {
    logger.debug(`${APP_NAME} has started | PORT: ${HttpPort}`)
  });
})();
