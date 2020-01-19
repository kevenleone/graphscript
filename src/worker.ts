import { defaults, logger } from '~/utils/globalMethods';
import { createTypeormConn } from '~/utils/typeORMConn';
import Queue from '~/utils/Queue';

(async (): Promise<void> => {
  const { APP_NAME } = defaults;
  await createTypeormConn();

  logger.debug(`Starting Worker ${APP_NAME} Server`);
  Queue.process();
})();
