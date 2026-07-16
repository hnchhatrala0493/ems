import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { listAudits } from '../controllers/audit.controller.js';
import { PERMISSIONS } from '../constants/permissions.js';

export const auditRoutes = Router();
auditRoutes.use(authenticate);
auditRoutes.get('/', requirePermission(PERMISSIONS['audit.view']), listAudits);
