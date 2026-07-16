import type { Role } from '../../constants/roles.js';
export type AuthTokenPayload={sub:string;role:Role;organizationId?:string};
