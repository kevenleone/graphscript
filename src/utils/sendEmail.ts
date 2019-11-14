import nodemailer from 'nodemailer'
import defaults from '../config/defaults'
import { MailOption } from '../interfaces/Mail'

export async function sendEmail({to,content, subject}: MailOption) {
  const config: any = await defaults.MailerConf();
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject,// Subject line
    html: `${content}` // html body
  };

  const info = await transporter.sendMail(mailOptions);

  if (defaults.ENVIRONMENT !== "production") {
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
