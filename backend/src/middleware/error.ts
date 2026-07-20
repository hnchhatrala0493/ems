// import type { ErrorRequestHandler, RequestHandler } from 'express';
// import { AppError } from '../utils/AppError.js';
// import { logger } from '../config/logger.js';
// export const notFound: RequestHandler = (req, _res, next) => next(new AppError(404, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND'));
// export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
//   const known = error instanceof AppError;
//   if (!known) logger.error('Unhandled error', { error });
//   res.status(known ? error.statusCode : 500).json({ success: false, message: known ? error.message : 'Internal server error', code: known ? error.code : 'INTERNAL_ERROR', ...(known && error.details ? { details: error.details } : {}) });
// };


import type {
  ErrorRequestHandler,
  RequestHandler,
} from 'express';

import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      404,
      `Route ${req.method} ${req.originalUrl} not found`,
      'NOT_FOUND',
    ),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  _next,
) => {
  const knownError = error instanceof AppError;

  if (!knownError) {
    const errorDetails =
      error instanceof Error
        ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        }
        : {
          name: 'UnknownError',
          message: String(error),
          rawError: error,
        };

    logger.error('Unhandled error', {
      ...errorDetails,
      request: {
        method: req.method,
        path: req.originalUrl,
        params: req.params,
        query: req.query,
      },
    });
  }

  const statusCode = knownError ? error.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: knownError
      ? error.message
      : 'Internal server error',
    code: knownError
      ? error.code
      : 'INTERNAL_ERROR',
    ...(knownError && error.details
      ? { details: error.details }
      : {}),
  });
};