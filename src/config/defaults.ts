import CONSTANTS from './contants'

const {
  RUN_PLAYGROUND, 
  JWT_SECRET, 
  NODE_ENV, 
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS 
} = process.env;

export default {
  CONSTANTS,
  ENVIRONMENT: NODE_ENV,
  JWT_SECRET: JWT_SECRET || "MY_SECRET_SECRET",
  RUN_PLAYGROUND: RUN_PLAYGROUND || NODE_ENV !== "production" ? true : false,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS
}