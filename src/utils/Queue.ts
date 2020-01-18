import Queue from 'bull';
import { defaults, logger } from './globalMethods';
const { REDIS_HOST } = defaults;

import * as Jobs from '../jobs';

const queues = Object.values(Jobs).map(job => ({
  bull: new Queue(job.key, { redis: { host: REDIS_HOST } }),
  name: job.key,
  handle: job.handle,
}));

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
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (_, err) => {
        console.log(err);
      });
    });
  },
};
