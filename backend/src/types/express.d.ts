import type { Role } from '../constants/roles.js';
declare global {
  namespace Express { interface Request { user?: { id: string; _id?: string; role: Role; organizationId?: string } } }
}
export {};
