import { env } from './environment.js';
export const redisConfig={url:env.REDIS_URL,enabled:Boolean(env.REDIS_URL)};
