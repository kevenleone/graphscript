import Mail from '~/utils/Mail';
import { defaults, constants } from '~/utils/globalMethods';
const { MAIL_FROM, APP_NAME } = defaults;
const { JOB_RECOVERY_MAILER } = constants;

export default {
  name: JOB_RECOVERY_MAILER,
  async handle({ data }: any): Promise<void> {
    const { email, name, token } = data;
    const config = {
      from: `${APP_NAME} Team <${MAIL_FROM}>`,
      to: `${name} <${email}>`,
      subject: 'Account Recovery',
      html: `Hey ${name}, Here's the recovery link: ${token}.`,
    };
    await Mail.sendMail(config);
  },
};
