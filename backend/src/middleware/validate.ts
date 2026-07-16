import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError.js';
export const validate = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) return next(new AppError(422, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten()));
  const parsed = result.data as { body?: unknown; params?: unknown };
  if (parsed.body !== undefined) req.body = parsed.body;
  if (parsed.params !== undefined) req.params = parsed.params as Request['params'];
  next();
};
