import nodemailer from 'nodemailer';

import { MailerCredentials } from './globalMethods';

export default nodemailer.createTransport(MailerCredentials());
