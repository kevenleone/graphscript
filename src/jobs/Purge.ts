import { User } from '../entity/User';
import { constants } from '../utils/globalMethods';

const { JOB_PURGE, PRIORITY_HIGH } = constants;

export default {
  active: true,
  config: {
    priority: PRIORITY_HIGH,
    repeat: {
      every: 86400000 * 7, // time in milisseconds
    },
  },
  async handle(): Promise<void> {
    /**
     * do something to run repeatedly according to repeat time;
     * example, run a report every day and send via-email for subscribed users
     */
    await User.findAndCount();
  },
  name: JOB_PURGE,
  selfRegister: true,
};
