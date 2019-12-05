import 'reflect-metadata';
import { ConfigResolver } from '../../../src/resolvers/config/config.resolver';
import { Configuration } from '../../../src/interfaces/Config';
import defaults from '../../../src/config/defaults';
import PKG from '../../../package.json';

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
