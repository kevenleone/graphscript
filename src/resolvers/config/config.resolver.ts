import { Query, Resolver } from 'type-graphql';
import { Configuration } from '../../interfaces';
import defaults from '../../config/defaults';
import PKG from '../../../package.json';

@Resolver()
export class ConfigResolver {
  @Query(() => Configuration, { name: `getConfig` })
  getConfig() {
    const { version: APP_VERSION } = PKG;
    const { APP_NAME } = defaults;
    return {
      APP_NAME,
      APP_VERSION,
    };
  }
}
