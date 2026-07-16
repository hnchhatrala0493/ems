export const roles = [
  'SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE',
  'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'PAYROLL_MANAGER', 'RECRUITER',
  'EMPLOYEE', 'FINANCE_USER', 'IT_ADMIN'
] as const;
export type Role = (typeof roles)[number];
