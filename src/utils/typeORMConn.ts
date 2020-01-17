import { getConnectionOptions, createConnection, ConnectionOptions, Connection } from 'typeorm';
import { logger } from './globalMethods';

export const createTypeormConn = async (): Promise<Connection> => {
  const { NODE_ENV = 'default' } = process.env;
  const connectionOptions: ConnectionOptions = await getConnectionOptions(NODE_ENV);
  logger.debug(`TypeORM Environment: ${NODE_ENV}`);
  return createConnection({ ...connectionOptions, name: 'default' });
};
