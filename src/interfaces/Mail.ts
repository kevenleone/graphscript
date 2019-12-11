export interface MailOption {
  to: string;
  content: string;
  subject: string;
}

export interface MailConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}
