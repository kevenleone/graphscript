import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

import { defaults, logger } from '../utils/globalMethods';
const { ENVIRONMENT, POSTGRES_URL } = defaults;

export const createTypeormConn = async (): Promise<Connection> => {
  logger.debug(`TypeORM Environment: ${ENVIRONMENT}`);
  if (ENVIRONMENT === 'production') {
    return createConnection({
      entities: ['./src/entity/*.js'],
      logging: true,
      name: 'default',
      ssl: true,
      synchronize: true,
      type: 'postgres',
      url: POSTGRES_URL,
    });
  }
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    ENVIRONMENT,
  );
  return createConnection({ ...connectionOptions, name: 'default' });
};
