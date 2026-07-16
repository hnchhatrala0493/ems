import type { RequestHandler } from 'express'; import { logger } from '../config/logger.js'; import { Audit } from '../models/Audit.js'; import {User} from '../models/User.js';
const sensitiveFields = new Set(['password', 'currentPassword', 'newPassword', 'refreshToken', 'token', 'code']);
const sanitize = (value: any): any => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sanitize);
  if (typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, payload]) => [key, sensitiveFields.has(key) ? '[FILTERED]' : sanitize(payload)])
  );
};

export const auditLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();
  const logContext = {
    userId: req.user?.id,
    role: req.user?.role,
    organizationId: req.user?.organizationId,
    method: req.method,
    path: req.originalUrl,
    params: req.params,
    query: req.query,
    body: sanitize(req.body),
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };

  res.on('finish', async () => {
    if (!req.user) return;
    const segments = req.path.split('/').filter(Boolean);
    const moduleName = segments[0] || 'system';
    const action = req.method === 'POST' ? 'CREATE' : req.method === 'PATCH' || req.method === 'PUT' ? 'UPDATE' : req.method === 'DELETE' ? 'DELETE' : 'VIEW';
    const failed = res.statusCode >= 400;
    const record = String(req.params.id || req.params.employeeId || segments.find((segment) => /^[a-f\d]{24}$/i.test(segment)) || '—');
    const actor=await User.findById(req.user.id).select('name email').lean().catch(()=>null);
    const auditRecord = {
      ...logContext,
      userName:actor?.name,
      userEmail:actor?.email,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      action,
      module: moduleName.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description: `${req.user.role.replaceAll('_', ' ')} ${action.toLowerCase()} request on ${moduleName.replace(/-/g, ' ')}`,
      record,
      status: failed ? 'FAILED' : 'SUCCESS',
      severity: res.statusCode >= 500 ? 'CRITICAL' : failed || action === 'DELETE' ? 'WARNING' : 'INFO'
    };

    logger.info('Audit event', auditRecord);
    Audit.create(auditRecord).catch((error) => logger.error('Audit persistence failed', { error }));
  });

  next();
};
