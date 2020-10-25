import { constants, defaults } from '../utils/globalMethods';
import Mail from '../utils/Mail';

const { APP_NAME, MAIL_FROM } = defaults;
const { JOB_REGISTRATION_MAILER } = constants;

export default {
  async handle({ data }: any): Promise<void> {
    const { email, firstName } = data;
    await Mail.sendMail({
      from: MAIL_FROM,
      html: `Hello, ${firstName}. you have been registered on ${APP_NAME}`,
      subject: `${APP_NAME} Sign Up`,
      to: `${firstName} <${email}>`,
    });
  },
  name: JOB_REGISTRATION_MAILER,
};
