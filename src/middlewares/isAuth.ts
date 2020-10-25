import jwt from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { promisify } from 'util';

import { MyContext } from '../interfaces';
import { defaults, getGraphqlOperation, logger } from '../utils/globalMethods';

export const isAuth: MiddlewareFn<MyContext> = async (ctx, next) => {
  const {
    AUTH_MIDDLEWARE_ENABLED,
    CONSTANTS: { AUTH_INVALID_TOKEN, AUTH_NOT_FOUND },
    JWT_SECRET,
  } = defaults;
  if (AUTH_MIDDLEWARE_ENABLED) {
    const {
      body,
      headers: { authorization },
    } = ctx.context.req;
    const operationName = getGraphqlOperation(body.query);
    if (authorization) {
      const token: string = authorization.split(' ').pop() || '';
      try {
        const user: any = await promisify(jwt.verify)(token, JWT_SECRET);
        ctx.context.req.headers.loggedUser = user;
        logger.debug(
          `${user.firstName} is running a graphQL request to ${operationName}`,
        );
        return next();
      } catch (e) {
        throw new Error(AUTH_INVALID_TOKEN);
      }
    }
    throw new Error(AUTH_NOT_FOUND);
  }
  return next();
};
