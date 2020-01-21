import Queue from 'bull';
import * as Jobs from '~/jobs';
import { defaults, constants, logger } from '~/utils/globalMethods';
const { REDIS_URL } = defaults;

const queues = Object.values(Jobs).map(job => {
  const { name, data, handle, config, selfRegister = false, active = true }: any = job;
  const bull = new Queue(name, { redis: { host: REDIS_URL } });
  if (selfRegister && active) bull.add(data, config);
  return {
    bull,
    name,
    handle,
    active,
  };
});

export default {
  queues,
  add(name: string, data?: any): any {
    const queue = this.queues.find(queue => queue.name === name);
    if (queue) {
      queue.bull.add(data);
      logger.info(`Job: ${name} added to Queue`);
      return queue;
    }
    logger.warn(`Job: [${name}] wasn't found, and nothing was add to Queue`);
    return new Error(constants.JOB_NOT_FOUND(name));
  },
  process(): void {
    logger.debug('Queue Process initialized');

    for (const queue of this.queues) {
      const { name, active } = queue;
      if (active) {
        queue.bull.process(queue.handle);

        queue.bull.on('completed', () => {
          logger.info(`[${name}] | [COMPLETED]`);
        });

        queue.bull.on('failed', (_, err) => {
          logger.error(`[${name}] | [FAILED] -> ${err.message}`);
        });
      }
    }
  },
};
