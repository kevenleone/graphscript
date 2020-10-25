import 'reflect-metadata';

import PKG from '../../../../package.json';
import defaults from '../../../../src/config/defaults';
import { Configuration } from '../../../../src/interfaces';
import { ConfigResolver } from '../../../../src/resolvers/config/config.resolver';

const Config = new ConfigResolver();

describe('Config Resolver', () => {
  it('Should validate Config Data', () => {
    const config: Configuration = {
      APP_NAME: defaults.APP_NAME,
      APP_VERSION: PKG.version,
    };
    expect(Config.getConfig()).toStrictEqual(config);
  });
});
