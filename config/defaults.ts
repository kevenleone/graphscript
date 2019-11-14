import nodemailer from 'nodemailer'
import CONSTANTS from './contants'
const { 
  JWT_SECRET, 
  NODE_ENV, 
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS 
} = process.env;
export default {
  CONSTANTS,
  JWT_SECRET: JWT_SECRET || "MY_SECRET_SECRET",
  async Mailer() {
    const config = {
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
      }
    };
    if (NODE_ENV !== "production") {
      const { user, pass } = await nodemailer.createTestAccount();
      config.auth.user = user;
      config.auth.pass = pass;
    }

    return config;
  }
}