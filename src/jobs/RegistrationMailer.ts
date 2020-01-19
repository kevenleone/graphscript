import Mail from '~/utils/Mail';
import { defaults, constants } from '~/utils/globalMethods';
const { APP_NAME, MAIL_FROM } = defaults;
const { JOB_REGISTRATION_MAILER } = constants;

export default {
  name: JOB_REGISTRATION_MAILER,
  async handle({ data }: any): Promise<void> {
    const { name, email } = data;
    await Mail.sendMail({
      from: MAIL_FROM,
      to: `${name} <${email}>`,
      subject: `${APP_NAME} Sign Up`,
      html: `Hello, ${name}. you have been registered on ${APP_NAME}`,
    });
  },
};
