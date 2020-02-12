import { isAuth } from '~/middlewares/isAuth';
import { constants } from '~/utils/globalMethods';
import { ctx, next } from '../test.utils';
const { AUTH_NOT_FOUND, AUTH_INVALID_TOKEN } = constants;

describe('Auth Middleware', () => {
  it(`Should pass through Auth Middleware without authorization and get ${AUTH_NOT_FOUND}`, async () => {
    isAuth(ctx, next).catch(err => expect(err.message).toStrictEqual(AUTH_NOT_FOUND));
  });

  it(`Should pass through Auth Middleware without authorization and get ${AUTH_INVALID_TOKEN}`, async () => {
    ctx.context.req.headers.authorization = 'ey...';
    isAuth(ctx, next).catch(err => expect(err.message).toStrictEqual(AUTH_INVALID_TOKEN));
  });
});
