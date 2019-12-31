import { getConnectionOptions, createConnection, ConnectionOptions, Connection } from 'typeorm';

export const createTypeormConn = async (): Promise<Connection> => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: 'default' });
};
