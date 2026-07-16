import { z } from 'zod';
import { ASSET_STATUSES, ASSET_TYPES } from '../models/Asset.js';

const optional = z.string().trim().optional();
const date = z.coerce.date().optional();

const assetSchema = z.object({
  assetName: z.string().min(1),
  assetCode: z.string().min(1),
  assetType: z.enum(ASSET_TYPES).default('OTHER'),
  serialNumber: optional,
  brand: optional,
  model: optional,
  purchaseDate: date,
  purchaseCost: z.coerce.number().optional(),
  warrantyExpiry: date,
  condition: optional,
  location: optional,
  status: z.enum(ASSET_STATUSES).default('AVAILABLE'),
  notes: optional
});

export const createAssetSchema = z.object({ body: assetSchema, query: z.any(), params: z.any() });
export const updateAssetSchema = z.object({ body: assetSchema.partial(), query: z.any(), params: z.object({ id: z.string() }) });
export const assignAssetSchema = z.object({ body: z.object({ employeeId: z.string().min(1), note: optional }), query: z.any(), params: z.object({ id: z.string() }) });
export const returnAssetSchema = z.object({ body: z.object({ note: optional }), query: z.any(), params: z.object({ id: z.string() }) });
