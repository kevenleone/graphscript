import { config } from 'dotenv';

import CONSTANTS from '../utils/contants';
config();

function normalizeBool(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  const expectedBooleans = ['false', 'true'];
  if (value && expectedBooleans.indexOf(value) > -1) {
    return JSON.parse(value);
  }
  return defaultValue;
}

const {
  APP_NAME,
  AUTH_MIDDLEWARE_ENABLED,
  JWT_SECRET,
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_USER,
  NODE_ENV,
  POSTGRES_URL,
  REDIS_PORT,
  REDIS_URL,
  RUN_PLAYGROUND,
  SENDGRID_PASSWORD,
  SENDGRID_USERNAME,
} = process.env;

export default {
  APP_NAME: APP_NAME || 'Graphscript',
  AUTH_MIDDLEWARE_ENABLED: normalizeBool(AUTH_MIDDLEWARE_ENABLED, false),
  CONSTANTS,
  ENVIRONMENT: NODE_ENV || 'development',
  JWT_SECRET: JWT_SECRET || 'MY_SECRET_SECRET',
  MAIL_FROM: MAIL_FROM || '',
  MAIL_HOST: MAIL_HOST || '',
  MAIL_PASS: MAIL_PASS || '',
  MAIL_PORT: Number(MAIL_PORT) || 527,
  MAIL_USER: MAIL_USER || '',
  POSTGRES_URL,
  REDIS_PORT,
  REDIS_URL,
  RUN_PLAYGROUND: normalizeBool(RUN_PLAYGROUND, NODE_ENV !== 'production'),
  SENDGRID_PASSWORD,
  SENDGRID_USERNAME,
  TEST_HOST: 'http://localhost:3333/graphql',
};
