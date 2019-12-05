import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../interfaces/MyContext';
import { logger, defaults, sendError, getGraphqlOperation } from '../utils/globalMethods';

export const isAuth: MiddlewareFn<MyContext> = async (_, next) => {
  const {
    JWT_SECRET,
    CONSTANTS: { AUTHORIZATION_NOT_FOUND, USER_TOKEN_INVALID },
  } = defaults;
  const {
    body,
    headers: { authorization },
  } = _.context.req;
  const operationName = getGraphqlOperation(body.query);
  if (authorization) {
    const token: string = authorization.split(' ').pop() || 'notAuth';
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
};
