import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import *as c from '../controllers/holiday.controller.js';
import { PERMISSIONS } from '../constants/permissions.js';

export const holidayRoutes = Router();

holidayRoutes.use(authenticate);
holidayRoutes.get('/', requirePermission(PERMISSIONS['holiday.view']), c.list);
const hr = requirePermission(PERMISSIONS['holiday.manage']);
holidayRoutes.post('/', hr, c.create);
holidayRoutes.patch('/:id', hr, c.update); holidayRoutes.delete('/:id', hr, c.remove);
