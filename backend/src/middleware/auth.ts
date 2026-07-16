import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { Role } from '../constants/roles.js';
import { AppError } from '../utils/AppError.js';

type TokenPayload = { sub: string; role: Role; organizationId?: string };
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  if (!token) return next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = { id: payload.sub, role: payload.role, organizationId: payload.organizationId };
    next();
  } catch { next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN')); }
}
export const authorize = (...allowed: Role[]) => (req: Request, _res: Response, next: NextFunction) =>
  req.user && allowed.includes(req.user.role) ? next() : next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
