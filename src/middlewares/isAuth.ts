import jwt from "jsonwebtoken";
import { promisify } from 'util';
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../interfaces/MyContext";
import defaults from "../config/defaults";
import { logger, sendError } from "../config/globalMethods";

export const isAuth: MiddlewareFn<MyContext> = async (_, next) => {
  const { JWT_SECRET, CONSTANTS: {AUTHORIZATION_NOT_FOUND, USER_TOKEN_INVALID }} = defaults;
  const { headers: { authorization } } = _.context.req;
  if (authorization) {
    const token: string = authorization.split(" ").pop() || "notAuth";
    try {
      const user: any = await promisify(jwt.verify)(token, JWT_SECRET);
      _.context.req.headers.loggedUser = user;
      logger.info(`${user.firstName} is running a call`);
      return next();
    } catch (e) {
      sendError(USER_TOKEN_INVALID);
    }
  }
  sendError(AUTHORIZATION_NOT_FOUND);
};  
