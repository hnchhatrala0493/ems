import { Schema, model, Types } from 'mongoose';

export const ASSET_TYPES = [
  'LAPTOP',
  'DESKTOP',
  'MOBILE',
  'SIM_CARD',
  'MONITOR',
  'KEYBOARD',
  'MOUSE',
  'ID_CARD',
  'ACCESS_CARD',
  'VEHICLE',
  'SOFTWARE_LICENSE',
  'OTHER'
] as const;

export const ASSET_STATUSES = ['AVAILABLE', 'ASSIGNED', 'UNDER_MAINTENANCE', 'DAMAGED', 'LOST', 'RETIRED'] as const;

export type AssetType = (typeof ASSET_TYPES)[number];
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export interface IAsset {
  organizationId?: string;
  assetName: string;
  assetCode: string;
  assetType: AssetType;
  serialNumber?: string;
  brand?: string;
  model?: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  warrantyExpiry?: Date;
  condition?: string;
  location?: string;
  status: AssetStatus;
  assignedEmployee?: Types.ObjectId | null;
  assignedAt?: Date | null;
  returnedAt?: Date | null;
  notes?: string;
  history?: Array<{
    action: 'ASSIGNED' | 'RETURNED' | 'STATUS_UPDATED';
    employeeId?: Types.ObjectId | null;
    employeeName?: string;
    fromStatus?: AssetStatus;
    toStatus?: AssetStatus;
    note?: string;
    createdAt: Date;
    changedBy?: string;
  }>;
  deletedAt?: Date | null;
}

const AssetSchema = new Schema<IAsset>({
  organizationId: { type: String, index: true },
  assetName: { type: String, required: true, trim: true },
  assetCode: { type: String, required: true, trim: true, index: true },
  assetType: { type: String, enum: ASSET_TYPES, default: 'OTHER', required: true },
  serialNumber: String,
  brand: String,
  model: String,
  purchaseDate: Date,
  purchaseCost: Number,
  warrantyExpiry: Date,
  condition: String,
  location: String,
  status: { type: String, enum: ASSET_STATUSES, default: 'AVAILABLE', index: true },
  assignedEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
  assignedAt: Date,
  returnedAt: Date,
  notes: String,
  history: [{
    action: { type: String, enum: ['ASSIGNED', 'RETURNED', 'STATUS_UPDATED'], required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    employeeName: String,
    fromStatus: String,
    toStatus: String,
    note: String,
    createdAt: { type: Date, default: Date.now },
    changedBy: String
  }],
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

AssetSchema.index({ organizationId: 1, assetCode: 1 }, { unique: true });

export const Asset = model<IAsset>('Asset', AssetSchema);
