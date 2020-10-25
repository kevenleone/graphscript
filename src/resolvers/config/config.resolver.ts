import { Query, Resolver } from 'type-graphql';

import PKG from '../../../package.json';
import defaults from '../../config/defaults';
import { Configuration } from '../../interfaces';

@Resolver()
export class ConfigResolver {
  @Query(() => Configuration, { name: `getConfig` })
  getConfig(): Configuration {
    const { version: APP_VERSION } = PKG;
    const { APP_NAME } = defaults;
    return {
      APP_NAME,
      APP_VERSION,
    };
  }
}
