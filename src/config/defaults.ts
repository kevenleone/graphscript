import CONSTANTS from '../utils/contants';
const {
  RUN_PLAYGROUND,
  JWT_SECRET,
  APP_NAME,
  NODE_ENV,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env;

export default {
  CONSTANTS,
  APP_NAME: APP_NAME || 'Graphscript',
  ENVIRONMENT: NODE_ENV,
  JWT_SECRET: JWT_SECRET || 'MY_SECRET_SECRET',
  RUN_PLAYGROUND: Boolean(String(RUN_PLAYGROUND) || NODE_ENV !== 'production'),
  MAIL_PORT: Number(MAIL_PORT) || 527,
  MAIL_HOST: MAIL_HOST || '',
  MAIL_USER: MAIL_USER || '',
  MAIL_PASS: MAIL_PASS || '',
  MAIL_FROM: MAIL_FROM || '',
};
