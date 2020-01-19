import { getConnectionOptions, createConnection, ConnectionOptions, Connection } from 'typeorm';
import { logger, defaults } from './globalMethods';
const { ENVIRONMENT, POSTGRES_URL } = defaults;

export const createTypeormConn = async (): Promise<Connection> => {
  logger.debug(`TypeORM Environment: ${ENVIRONMENT}`);
  if (ENVIRONMENT === 'production') {
    return createConnection({
      entities: ['./src/entity/*.js'],
      synchronize: true,
      name: 'default',
      url: POSTGRES_URL,
      type: 'postgres',
      logging: true,
      ssl: true,
    });
  }
  const connectionOptions: ConnectionOptions = await getConnectionOptions(ENVIRONMENT);
  return createConnection({ ...connectionOptions, name: 'default' });
};
