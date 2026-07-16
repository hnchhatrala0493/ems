type Entry={value:unknown;expires:number}; const cache=new Map<string,Entry>();
const key=(userId:string,organizationId:string)=>`permissions:${organizationId}:${userId}`;
export const permissionCacheService={
  get<T>(userId:string,organizationId:string){const e=cache.get(key(userId,organizationId));if(!e||e.expires<Date.now()){if(e)cache.delete(key(userId,organizationId));return null}return e.value as T},
  set(userId:string,organizationId:string,value:unknown,ttlSeconds=300){cache.set(key(userId,organizationId),{value,expires:Date.now()+ttlSeconds*1000})},
  invalidateUser(userId:string,organizationId:string){cache.delete(key(userId,organizationId))},
  invalidateRole(_roleId:string){cache.clear()}, invalidateOrganization(organizationId:string){for(const k of cache.keys())if(k.startsWith(`permissions:${organizationId}:`))cache.delete(k)}
};

