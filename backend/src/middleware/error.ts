import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';
export const notFound: RequestHandler = (req, _res, next) => next(new AppError(404, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND'));
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const known = error instanceof AppError;
  if (!known) logger.error('Unhandled error', { error });
  res.status(known ? error.statusCode : 500).json({ success: false, message: known ? error.message : 'Internal server error', code: known ? error.code : 'INTERNAL_ERROR', ...(known && error.details ? { details: error.details } : {}) });
};
