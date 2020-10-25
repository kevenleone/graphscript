import 'reflect-metadata';

import defaults from '~/config/defaults';
import { Configuration } from '~/interfaces';
import { ConfigResolver } from '~/resolvers/config/config.resolver';

import PKG from '../../../../package.json';

const Config = new ConfigResolver();

describe('Config Resolver', () => {
  it('Should validate Config Data', () => {
    const config: Configuration = {
      APP_VERSION: PKG.version,
      APP_NAME: defaults.APP_NAME,
    };
    expect(Config.getConfig()).toStrictEqual(config);
  });
});
