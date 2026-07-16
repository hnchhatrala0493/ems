import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requirePermission } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import * as c from '../controllers/asset.controller.js';
import { assignAssetSchema, createAssetSchema, returnAssetSchema, updateAssetSchema } from '../validations/asset.validation.js';
import { PERMISSIONS } from '../constants/permissions.js';

const manage = requirePermission(PERMISSIONS['asset.manage']);
export const assetRoutes = Router();
assetRoutes.use(authenticate);
assetRoutes.get('/', requirePermission(PERMISSIONS['asset.view']), c.listAssets);
assetRoutes.get('/:id', requirePermission(PERMISSIONS['asset.view']), c.getAsset);
assetRoutes.post('/', manage, validate(createAssetSchema), c.createAsset);
assetRoutes.patch('/:id', manage, validate(updateAssetSchema), c.updateAsset);
assetRoutes.post('/:id/assign', manage, validate(assignAssetSchema), c.assignAsset);
assetRoutes.post('/:id/return', manage, validate(returnAssetSchema), c.returnAsset);
