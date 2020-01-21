import { constants } from '~/utils/globalMethods';
import { User } from '~/entity/User';

const { JOB_PURGE, PRIORITY_HIGH } = constants;

export default {
  name: JOB_PURGE,
  active: true,
  selfRegister: true,
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
};
