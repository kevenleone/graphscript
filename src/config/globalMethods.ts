import nodemailer from 'nodemailer'
import Logger from './logger'
import Defaults from './defaults'

export const logger = Logger;
export const defaults = Defaults;

export function sendError(message: string, shouldReturn: boolean = false): Error {
  logger.error(message);
  const Err: Error = new Error(message);
  if (!shouldReturn) {
    throw Err;
  }
  return Err;
}

export function HttpError(message: string): Error{
  return sendError(message, true);
}

export async function MailerConf() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, ENVIRONMENT } = defaults;
  const config = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
    }
  };
  if (ENVIRONMENT !== "production") {
    const { user, pass } = await nodemailer.createTestAccount();
    config.auth.user = user;
    config.auth.pass = pass;
  }

  return config;
}