import jwt from "jsonwebtoken";
import { promisify } from 'util';
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../interfaces/MyContext";
import defaults from "../config/defaults";

export const isAuth: MiddlewareFn<MyContext> = async (_, next) => {
  const { AUTHORIZATION_NOT_FOUND, USER_TOKEN_INVALID } = defaults.CONSTANTS;
  const { headers: { authorization } } = _.context.req;
  if (authorization) {
    const token: string = authorization.split(" ").pop() || "notAuth";
    try {
      const user: any = await promisify(jwt.verify)(token, defaults.JWT_SECRET);
      console.log(new Date().toISOString(), `| ${user.firstName} is running a call`);
      return next();
    } catch (e) {
      throw new Error(USER_TOKEN_INVALID);
    }
  }
  throw new Error(AUTHORIZATION_NOT_FOUND);
};  
