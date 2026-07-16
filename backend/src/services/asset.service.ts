import { Asset, type IAsset, type AssetStatus } from '../models/Asset.js';
import { AppError } from '../utils/AppError.js';
import { Employee } from '../models/Employee.js';

export class AssetService {
  async list(page: number, limit: number, organizationId?: string, search?: string, status?: string, type?: string) {
    const filter: Record<string, unknown> = { deletedAt: null, ...(organizationId ? { organizationId } : {}) };
    if (search) {
      filter.$or = ['assetName', 'assetCode', 'serialNumber', 'brand', 'model', 'location'].map((key) => ({ [key]: { $regex: search, $options: 'i' } }));
    }
    if (status) filter.status = status;
    if (type) filter.assetType = type;

    const [items, total] = await Promise.all([
      Asset.find(filter).populate('assignedEmployee', 'firstName lastName employeeId').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Asset.countDocuments(filter)
    ]);

    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async get(id: string, organizationId?: string) {
    const item = await Asset.findById(id).populate('assignedEmployee', 'firstName lastName employeeId').lean();
    if (!item || (organizationId && item.organizationId !== organizationId)) throw new AppError(404, 'Asset not found', 'NOT_FOUND');
    return item;
  }

  async create(input: Record<string, any>) {
    const asset = await Asset.create(input as IAsset);
    return asset;
  }

  async update(id: string, input: Record<string, any>, organizationId?: string, actor?: string) {
    const asset = await Asset.findOne({ _id: id, ...(organizationId ? { organizationId } : {}), deletedAt: null });
    if (!asset) throw new AppError(404, 'Asset not found', 'NOT_FOUND');

    const previousStatus = asset.status;
    const updated = { ...input };
    if (updated.status && updated.status !== previousStatus) {
      asset.history = asset.history || [];
      asset.history.push({
        action: 'STATUS_UPDATED',
        fromStatus: previousStatus,
        toStatus: updated.status as AssetStatus,
        note: updated.notes,
        createdAt: new Date(),
        changedBy: actor
      });
    }

    Object.assign(asset, updated);
    if (updated.status && updated.status !== previousStatus) {
      asset.status = updated.status as AssetStatus;
    }
    return asset.save();
  }

  async assign(id: string, input: { employeeId?: string; note?: string }, organizationId?: string, actor?: string) {
    const asset = await Asset.findOne({ _id: id, ...(organizationId ? { organizationId } : {}), deletedAt: null });
    if (!asset) throw new AppError(404, 'Asset not found', 'NOT_FOUND');
    if (!input.employeeId) throw new AppError(422, 'Employee is required', 'VALIDATION_ERROR');

    const employee = await Employee.findById(input.employeeId).lean();
    if (!employee) throw new AppError(404, 'Employee not found', 'NOT_FOUND');

    asset.assignedEmployee = employee._id as any;
    asset.assignedAt = new Date();
    asset.returnedAt = null;
    asset.status = 'ASSIGNED';
    asset.history = asset.history || [];
    asset.history.push({
      action: 'ASSIGNED',
      employeeId: employee._id as any,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      fromStatus: asset.status === 'ASSIGNED' ? 'ASSIGNED' : 'AVAILABLE',
      toStatus: 'ASSIGNED',
      note: input.note,
      createdAt: new Date(),
      changedBy: actor
    });

    return asset.save();
  }

  async return(id: string, input: { note?: string }, organizationId?: string, actor?: string) {
    const asset = await Asset.findOne({ _id: id, ...(organizationId ? { organizationId } : {}), deletedAt: null });
    if (!asset) throw new AppError(404, 'Asset not found', 'NOT_FOUND');

    asset.assignedEmployee = null;
    asset.returnedAt = new Date();
    asset.status = 'AVAILABLE';
    asset.history = asset.history || [];
    asset.history.push({
      action: 'RETURNED',
      employeeId: null,
      employeeName: undefined,
      fromStatus: 'ASSIGNED',
      toStatus: 'AVAILABLE',
      note: input.note,
      createdAt: new Date(),
      changedBy: actor
    });

    return asset.save();
  }
}
