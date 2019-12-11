import nodemailer from 'nodemailer';
import { MailerCredentials, defaults, logger } from './globalMethods';
import { MailConfig, MailOption } from '../interfaces';

export async function sendEmail({ to, content, subject }: MailOption): Promise<void> {
  const config: MailConfig = await MailerCredentials();
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>',
    to, // list of receivers
    subject, // Subject line
    html: `${content}`, // html body
  };

  const info = await transporter.sendMail(mailOptions);
  if (defaults.ENVIRONMENT !== 'production') {
    logger.debug(`Message sent: ${info.messageId}`);
    // Preview only available when sending through an Ethereal account
    logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
