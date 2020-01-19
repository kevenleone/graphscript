import { config } from 'dotenv';
import CONSTANTS from '~/utils/contants';
config();

function normalizeBool(value: string | undefined, defaultValue: boolean): boolean {
  const expectedBooleans = ['false', 'true'];
  if (value && expectedBooleans.indexOf(value) > -1) {
    return JSON.parse(value);
  }
  return defaultValue;
}

const {
  AUTH_MIDDLEWARE_ENABLED,
  RUN_PLAYGROUND,
  JWT_SECRET,
  APP_NAME,
  NODE_ENV,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  REDIS_URL,
  REDIS_PORT,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
} = process.env;

export default {
  CONSTANTS,
  REDIS_URL,
  REDIS_PORT,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  AUTH_MIDDLEWARE_ENABLED: normalizeBool(AUTH_MIDDLEWARE_ENABLED, false),
  RUN_PLAYGROUND: normalizeBool(RUN_PLAYGROUND, NODE_ENV !== 'production'),
  APP_NAME: APP_NAME || 'Graphscript',
  ENVIRONMENT: NODE_ENV,
  JWT_SECRET: JWT_SECRET || 'MY_SECRET_SECRET',
  MAIL_PORT: Number(MAIL_PORT) || 527,
  MAIL_HOST: MAIL_HOST || '',
  MAIL_USER: MAIL_USER || '',
  MAIL_PASS: MAIL_PASS || '',
  MAIL_FROM: MAIL_FROM || '',
  TEST_HOST: 'http://localhost:4000/graphql',
};
