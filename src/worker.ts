import 'reflect-metadata';
import { config } from 'dotenv';

import { defaults, logger } from '~/utils/globalMethods';
import Queue from '~/utils/Queue';

(async (): Promise<void> => {
  config();
  const { APP_NAME } = defaults;
  logger.debug(`Starting Worker ${APP_NAME} Server`);
  Queue.process();
})();
