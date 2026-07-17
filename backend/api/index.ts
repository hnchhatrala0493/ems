import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { env } from '../src/config/env.js';

let connection: Promise<typeof mongoose> | undefined;

function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  connection ??= mongoose.connect(env.MONGODB_URI).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

export default async function handler(req: Request, res: Response) {
  await connectDatabase();
  return app(req, res);
}
