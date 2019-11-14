import { config } from 'dotenv';
import 'reflect-metadata';
import { ApolloServer, Config } from 'apollo-server-express';
import Express from 'express';
import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import createSchema from './utils/createSchema';
import defaults from '../config/defaults';

(async () => {
  config();
  const { NODE_ENV, PORT } = process.env;
  const HttpPort = PORT || 3333;
  const environment = NODE_ENV === "production" ? "production" : "default"; 
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    environment
  );

  await createConnection({
    ...connectionOptions,
    name: "default"
  });

  const apolloServerConfig: Config = {
    schema: await createSchema(),
    playground: defaults.RUN_PLAYGROUND,
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
    console.log(`Server is running on ${HttpPort}`);
  });
})();
