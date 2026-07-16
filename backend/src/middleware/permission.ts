import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import type { Permission } from '../constants/permissions.js';
import { rolePermissions } from '../constants/permissions.js';
import { User } from '../models/User.js'; import { RoleDefinition } from '../models/RoleDefinition.js';

export const requirePermission = (...permissions: Permission[]) => async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
  let available:string[] = rolePermissions[req.user.role] || [];
  const user=await User.findById(req.user.id).select('customRoleId').lean(); if(user?.customRoleId){const role=await RoleDefinition.findOne({_id:user.customRoleId,status:'ACTIVE'}).lean();if(role)available=[...available,...role.permissions]}
  const allowed = permissions.every((permission) => available.includes(permission));
  return allowed ? next() : next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
};

export const requireAnyPermission = (...permissions: Permission[]) => async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
  let available:string[] = rolePermissions[req.user.role] || [];
  const user=await User.findById(req.user.id).select('customRoleId').lean();
  if(user?.customRoleId){const role=await RoleDefinition.findOne({_id:user.customRoleId,status:'ACTIVE'}).lean();if(role)available=[...available,...role.permissions]}
  return permissions.some(permission => available.includes(permission)) ? next() : next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
};
