import mongoose from 'mongoose'; import { env } from './environment.js';
export const connectDatabase=()=>mongoose.connect(env.MONGODB_URI);
export const disconnectDatabase=()=>mongoose.disconnect();
