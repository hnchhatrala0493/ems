// @ts-nocheck
import { User } from '../../models/User.js'; import { AppError } from '../../utils/AppError.js'; import { AccessPermission,AccessRole,RolePermission,UserPermissionOverride,UserRole } from './access-control.models.js'; import { permissionCacheService } from './permission-cache.service.js'; import { scopeRank,type Scope } from './access-control.constants.js';
export type EffectivePermission={code:string;effect:'ALLOW'|'DENY';scope:Scope;source:'ROLE'|'USER_OVERRIDE';conditions?:unknown};
export async function resolvePermissions(userId:string,organizationId:string){
 const cached=permissionCacheService.get<{roles:unknown[];permissions:EffectivePermission[]}>(userId,organizationId);if(cached)return cached;
 const user=await User.findOne({_id:userId,organizationId,active:true}).lean();if(!user)throw new AppError(403,'User is inactive or unavailable','ACCESS_DENIED');const now=new Date();
 const assignments=await UserRole.find({userId,organizationId,status:'ACTIVE',effectiveFrom:{$lte:now},$or:[{effectiveUntil:null},{effectiveUntil:{$gt:now}}]}).lean();
 const roles=await AccessRole.find({_id:{$in:assignments.map(x=>x.roleId)},status:'ACTIVE',isDeleted:false}).lean();const roleIds=roles.map(x=>x._id);
 const [roleRules,overrides]=await Promise.all([RolePermission.find({roleId:{$in:roleIds}}).populate({path:'permissionId',match:{status:'ACTIVE',isDeleted:false}}).lean(),UserPermissionOverride.find({userId,organizationId,status:'ACTIVE',effectiveFrom:{$lte:now},$or:[{effectiveUntil:null},{effectiveUntil:{$gt:now}}]}).populate({path:'permissionId',match:{status:'ACTIVE',isDeleted:false}}).lean()]);
 const result=new Map<string,EffectivePermission>();
 for(const r of roleRules){const p=r.permissionId as any;if(!p)continue;const current=result.get(p.code);const next:EffectivePermission={code:p.code,effect:r.effect,scope:r.scope,source:'ROLE',conditions:r.conditions};if(!current||r.effect==='DENY'||(current.effect!=='DENY'&&scopeRank[r.scope as Scope]>scopeRank[current.scope]))result.set(p.code,next)}
 for(const r of overrides){const p=r.permissionId as any;if(!p)continue;const current=result.get(p.code);if(current?.effect==='DENY'&&r.effect==='ALLOW')continue;result.set(p.code,{code:p.code,effect:r.effect,scope:r.scope,source:'USER_OVERRIDE',conditions:r.conditions})}
 const value={roles:assignments.map(a=>{const role=roles.find(r=>String(r._id)===String(a.roleId));return{id:a.roleId,name:role?.name,isPrimary:a.isPrimary}}),permissions:[...result.values()]};permissionCacheService.set(userId,organizationId,value);return value;
}
export async function checkPermission(userId:string,organizationId:string,code:string){const data=await resolvePermissions(userId,organizationId);return data.permissions.find(p=>p.code===code)?.effect==='ALLOW'}
