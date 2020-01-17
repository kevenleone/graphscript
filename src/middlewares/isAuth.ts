import { MiddlewareFn } from 'type-graphql';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import { MyContext } from '~/interfaces';
import { logger, defaults, sendError, getGraphqlOperation } from '~/utils/globalMethods';

export const isAuth: MiddlewareFn<MyContext> = async (_, next) => {
  const {
    CONSTANTS: { AUTHORIZATION_NOT_FOUND, USER_TOKEN_INVALID },
    AUTH_MIDDLEWARE_ENABLED,
    JWT_SECRET,
  } = defaults;
  if (AUTH_MIDDLEWARE_ENABLED) {
    const {
      body,
      headers: { authorization },
    } = _.context.req;
    const operationName = getGraphqlOperation(body.query);
    if (authorization) {
      const token: string = authorization.split(' ').pop() || '';
      try {
        const user: any = await promisify(jwt.verify)(token, JWT_SECRET);
        _.context.req.headers.loggedUser = user;
        logger.debug(`${user.firstName} is running a graphQL request to ${operationName}`);
        return next();
      } catch (e) {
        sendError(USER_TOKEN_INVALID);
      }
    }
    sendError(AUTHORIZATION_NOT_FOUND);
  }
  return next();
};
