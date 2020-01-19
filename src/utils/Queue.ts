import Queue from 'bull';
import { defaults, logger } from './globalMethods';
const { REDIS_HOST } = defaults;

import * as Jobs from '../jobs';

const queues = Object.values(Jobs).map(job => {
  const { name, data, handle, config, selfRegister = false, active = true }: any = job;
  const bull = new Queue(name, { redis: { host: REDIS_HOST } });
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
  add(name: string, data: any): any {
    logger.info(`Added ${name} to queue`);
    const queue = this.queues.find(queue => queue.name === name);
    if (queue) {
      return queue.bull.add(data);
    }
  },
  process(): void {
    logger.debug('Queue Process initialized');

    for (const queue of this.queues) {
      const { name, active } = queue;
      if (active) {
        queue.bull.process(queue.handle);

        queue.bull.on('active', () => {
          logger.info(`[${name}] | [ACTIVE]`);
        });

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
