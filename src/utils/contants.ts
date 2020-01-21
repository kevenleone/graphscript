export default {
  JOB_NOT_FOUND: (name: string): string => `JOB ${name.toUpperCase()} NOT FOUND`,

  JOB_REGISTRATION_MAILER: 'JOB_REGISTRATION_MAILER',
  JOB_RECOVERY_MAILER: 'JOB_RECOVERY_MAILER',
  JOB_PURGE: 'JOB_PURGE',

  PRIORITY_CRITICAL: 1,
  PRIORITY_HIGH: 2,
  PRIORITY_LOW: 3,

  USER_NOT_FOUND: 'User not found',
  USER_PASSWORD_INVALID: 'Password is wrong, try again',
  USER_TOKEN_INVALID: 'Token is invalid',
  AUTHORIZATION_NOT_FOUND: 'Authorization Header not found',
};
