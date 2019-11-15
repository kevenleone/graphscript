import nodemailer from 'nodemailer'
import { MailerConf, defaults, logger } from '../config/globalMethods'
import { MailOption } from '../interfaces/Mail'

export async function sendEmail({to,content, subject}: MailOption) {
  const config: any = await MailerConf();
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject,// Subject line
    html: `${content}` // html body
  };

  const info = await transporter.sendMail(mailOptions);
  if (defaults.ENVIRONMENT !== "production") {
    logger.info(`Message sent: ${info.messageId}`);
    // Preview only available when sending through an Ethereal account
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
