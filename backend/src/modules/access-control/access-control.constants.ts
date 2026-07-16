export const STATUSES=['ACTIVE','INACTIVE'] as const;
export const SCOPES=['OWN','TEAM','DEPARTMENT','BRANCH','ORGANIZATION','ALL'] as const;
export const EFFECTS=['ALLOW','DENY'] as const;
export const RISKS=['LOW','MEDIUM','HIGH','CRITICAL'] as const;
export type Scope=typeof SCOPES[number];
export const scopeRank:Record<Scope,number>={OWN:1,TEAM:2,DEPARTMENT:3,BRANCH:4,ORGANIZATION:5,ALL:6};

