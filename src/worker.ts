import { config } from 'dotenv';

import { defaults, logger } from './utils/globalMethods';
import Queue from './utils/Queue';
import { createTypeormConn } from './utils/typeORMConn';

(async (): Promise<void> => {
  config();
  const { APP_NAME } = defaults;
  await createTypeormConn();

  logger.debug(`Starting Worker ${APP_NAME} Server`);
  Queue.process();
})();
