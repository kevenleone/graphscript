import Mail from '~/utils/Mail';
import { defaults, logger, constants } from '~/utils/globalMethods';
const { MAIL_FROM, APP_NAME } = defaults;
const { JOB_RECOVERY_MAILER } = constants;

export default {
  key: JOB_RECOVERY_MAILER,
  async handle({ data }: any): Promise<void> {
    const { email, name, token } = data;
    await Mail.sendMail({
      from: `${APP_NAME} Team <${MAIL_FROM}>`,
      to: `${name} <${email}>`,
      subject: 'Account Recovery',
      html: `Hey ${name}, Here's the recovery link: ${token}.`,
    });

    logger.info(`Email recovery sent to: ${name}`);
  },
};
