import type { NextFunction, Request, Response } from 'express';
import { AssetService } from '../services/asset.service.js';
import { ok } from '../utils/response.js';

const service = new AssetService();

export async function listAssets(req: Request, res: Response, next: NextFunction) {
  try {
    ok(
      res,
      await service.list(
        Number(req.query.page) || 1,
        Math.min(Number(req.query.limit) || 10, 100),
        req.user?.organizationId,
        req.query.search as string | undefined,
        req.query.status as string | undefined,
        req.query.type as string | undefined
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function getAsset(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await service.get(String(req.params.id), req.user?.organizationId));
  } catch (error) {
    next(error);
  }
}

export async function createAsset(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await service.create({ ...req.body, organizationId: req.user?.organizationId }), 'Asset created', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAsset(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await service.update(String(req.params.id), req.body, req.user?.organizationId, req.user?.id), 'Asset updated');
  } catch (error) {
    next(error);
  }
}

export async function assignAsset(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await service.assign(String(req.params.id), req.body, req.user?.organizationId, req.user?.id), 'Asset assigned');
  } catch (error) {
    next(error);
  }
}

export async function returnAsset(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await service.return(String(req.params.id), req.body, req.user?.organizationId, req.user?.id), 'Asset returned');
  } catch (error) {
    next(error);
  }
}
