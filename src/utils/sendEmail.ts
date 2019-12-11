import nodemailer from 'nodemailer';
import { MailerCredentials, defaults, logger } from './globalMethods';
import { MailOption } from '../interfaces';

export async function sendEmail({ to, subject, content }: MailOption): Promise<void> {
  const { ENVIRONMENT, MAIL_FROM } = defaults;
  const config = await MailerCredentials();
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: MAIL_FROM,
    to, // list of receivers
    subject, // Subject line
    html: `${content}`, // html body
  };

  const info = await transporter.sendMail(mailOptions);
  if (ENVIRONMENT !== 'production') {
    logger.debug(`Message sent: ${info.messageId}`);
    // Preview only available when sending through an Ethereal account
    logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
