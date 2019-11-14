import nodemailer from 'nodemailer'
import defaults from '../../config/defaults'

export async function sendEmail(email: string, url: string) {
  const config: any = await defaults.Mailer();
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<a href="${url}">${url}</a>` // html body
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
