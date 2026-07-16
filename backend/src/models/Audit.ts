import { Schema, model } from 'mongoose';
import type { Role } from '../constants/roles.js';

export interface IAudit {
  userId?: string;
  userName?: string;
  userEmail?: string;
  role?: Role;
  organizationId?: string;
  method: string;
  path: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  body: unknown;
  ip: string;
  userAgent?: string;
  statusCode?: number;
  durationMs?: number;
  action?: string;
  module?: string;
  description?: string;
  record?: string;
  status?: 'SUCCESS' | 'FAILED';
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
}

const auditSchema = new Schema<IAudit>(
  {
    userId: String,
    userName: String,
    userEmail: String,
    role: { type: String, enum: ['SUPER_ADMIN','ORGANIZATION_ADMIN','HR_ADMIN','HR_EXECUTIVE','DEPARTMENT_MANAGER','TEAM_LEADER','PAYROLL_MANAGER','RECRUITER','EMPLOYEE','FINANCE_USER'] },
    organizationId: String,
    method: { type: String, required: true },
    path: { type: String, required: true },
    params: { type: Schema.Types.Mixed, default: {} },
    query: { type: Schema.Types.Mixed, default: {} },
    body: { type: Schema.Types.Mixed, default: {} },
    ip: String,
    userAgent: String,
    statusCode: Number,
    durationMs: Number
    ,action: String,
    module: String,
    description: String,
    record: String,
    status: { type: String, enum: ['SUCCESS', 'FAILED'] },
    severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'] }
  },
  { timestamps: true }
);

auditSchema.index({ organizationId: 1, userId: 1, createdAt: -1 });

export const Audit = model<IAudit>('Audit', auditSchema);
