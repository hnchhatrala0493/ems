import { env } from './environment.js';
export const emailConfig={host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_PORT===465,user:env.SMTP_USER,password:env.SMTP_APP_PASSWORD||env.SMTP_PASSWORD,from:env.SMTP_FROM};
