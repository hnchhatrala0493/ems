import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: ['.env.local', '.env'] });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1).default('mongodb+srv://himanshupatel0493:GZqzbTSNtfl3fbgC@himanshucluster.rdxdf.mongodb.net/employee_management_system'),
  JWT_ACCESS_SECRET: z.string().min(32).default('development-access-secret-change-me'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('https://workforceprohub.vercel.app'),
  FRONTEND_URL: z.string().url().default('https://workforceprohub.vercel.app'),
  LANDING_PAGE_URL: z.string().url().default('https://workforceprohub.vercel.app'),
  EMS_APP_URL: z.string().url().default('https://ems-workforcepro.vercel.app'),
  EMS_LOGIN_URL: z.string().url().default('https://ems-workforcepro.vercel.app/login'),
  ALLOWED_ORIGINS: z.string().default('https://workforceprohub.vercel.app,https://ems-workforcepro.vercel.app'),
  SMTP_HOST: z.string().default('smtp.gmail.com'), SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(''), SMTP_PASSWORD: z.string().default(''), SMTP_APP_PASSWORD: z.string().default(''), SMTP_PASS: z.string().default(''), SMTP_FROM: z.string().default(''),
  DEMO_REQUEST_NOTIFICATION_EMAIL: z.string().email().default('admin@example.com'),
  CLOUDINARY_CLOUD_NAME: z.string().default(''), CLOUDINARY_API_KEY: z.string().default(''), CLOUDINARY_API_SECRET: z.string().default(''),
  REDIS_URL: z.string().default(''), OPENAI_API_KEY: z.string().default(''), ENCRYPTION_KEY: z.string().default(''),
  LOG_LEVEL: z.string().default('info')
}).superRefine((value, context) => {
  for (const origin of value.CLIENT_URL.split(',').map(x => x.trim())) { if (!z.string().url().safeParse(origin).success) context.addIssue({ code: 'custom', path: ['CLIENT_URL'], message: 'CLIENT_URL must contain valid comma-separated origins.' }) }
  if (value.NODE_ENV !== 'production') return;
  const unsafe = (secret: string) => secret.length < 32 || /development|change-me/i.test(secret);
  if (unsafe(value.JWT_ACCESS_SECRET)) context.addIssue({ code: 'custom', path: ['JWT_ACCESS_SECRET'], message: 'A strong production access-token secret is required.' });
  if (unsafe(value.JWT_REFRESH_SECRET)) context.addIssue({ code: 'custom', path: ['JWT_REFRESH_SECRET'], message: 'A strong production refresh-token secret is required.' });
  if (!value.ENCRYPTION_KEY || unsafe(value.ENCRYPTION_KEY)) context.addIssue({ code: 'custom', path: ['ENCRYPTION_KEY'], message: 'A strong production encryption key is required.' });
  if (/localhost|127\.0\.0\.1/i.test(value.MONGODB_URI)) context.addIssue({ code: 'custom', path: ['MONGODB_URI'], message: 'A production MongoDB URI is required.' });
  const requiredOrigins = ['https://workforceprohub.vercel.app', 'https://ems-workforcepro.vercel.app'];
  const origins = value.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean);
  for (const origin of requiredOrigins) if (!origins.includes(origin)) context.addIssue({ code: 'custom', path: ['ALLOWED_ORIGINS'], message: `Missing required production origin: ${origin}` });
  if (value.SMTP_USER && !(value.SMTP_APP_PASSWORD || value.SMTP_PASSWORD || value.SMTP_PASS)) context.addIssue({ code: 'custom', path: ['SMTP_APP_PASSWORD'], message: 'An SMTP password or app password is required when SMTP_USER is configured.' });
  if (value.FRONTEND_URL !== 'https://workforceprohub.vercel.app' || value.LANDING_PAGE_URL !== 'https://workforceprohub.vercel.app') context.addIssue({ code: 'custom', path: ['FRONTEND_URL'], message: 'Landing-page production URLs are invalid.' });
  if (value.EMS_APP_URL !== 'https://ems-workforcepro.vercel.app' || value.EMS_LOGIN_URL !== 'https://ems-workforcepro.vercel.app/login') context.addIssue({ code: 'custom', path: ['EMS_APP_URL'], message: 'EMS production URLs are invalid.' });
});

export const env = schema.parse(process.env);
