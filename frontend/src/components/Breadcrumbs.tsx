import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const trails: Record<string, Array<{ label: string; to?: string }>> = {
  '/': [{ label: 'Dashboard' }],
  '/employees': [{ label: 'Dashboard', to: '/' }, { label: 'Employees' }],
  '/employees/new': [{ label: 'Dashboard', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Add employee' }],
  '/employees/directory': [{ label: 'Dashboard', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Employee Directory' }],
  '/employees/history': [{ label: 'Dashboard', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Employee History' }],
  '/employees/import': [{ label: 'Dashboard', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Import Employees' }],
  '/organization': [{ label: 'Dashboard', to: '/' }, { label: 'Organization' }],
  '/masters': [{ label: 'Dashboard', to: '/' }, { label: 'Departments & Masters' }],
  '/attendance': [{ label: 'Dashboard', to: '/' }, { label: 'Attendance' }],
  '/shifts': [{ label: 'Dashboard', to: '/' }, { label: 'Shifts' }],
  '/leaves': [{ label: 'Dashboard', to: '/' }, { label: 'Leave Management' }],
  '/holidays': [{ label: 'Dashboard', to: '/' }, { label: 'Holiday Calendar' }],
  '/payroll': [{ label: 'Dashboard', to: '/' }, { label: 'Payroll' }],
  '/performance': [{ label: 'Dashboard', to: '/' }, { label: 'Performance' }],
  '/recruitment': [{ label: 'Dashboard', to: '/' }, { label: 'Recruitment' }],
  '/onboarding': [{ label: 'Dashboard', to: '/' }, { label: 'Onboarding' }],
  '/profile': [{ label: 'Dashboard', to: '/' }, { label: 'My Profile' }],
  '/offboarding': [{ label: 'Dashboard', to: '/' }, { label: 'Offboarding' }],
  '/documents': [{ label: 'Dashboard', to: '/' }, { label: 'Documents' }],
  '/assets': [{ label: 'Dashboard', to: '/' }, { label: 'Assets' }],
  '/roles': [{ label: 'Dashboard', to: '/' }, { label: 'Roles & Permissions' }],
  '/modules': [{ label: 'Dashboard', to: '/' }, { label: 'Roles & Permissions', to: '/roles' }, { label: 'Dynamic Modules' }],
  '/notifications': [{ label: 'Dashboard', to: '/' }, { label: 'Notifications' }],
  '/announcements': [{ label: 'Dashboard', to: '/' }, { label: 'Announcements' }],
  '/helpdesk': [{ label: 'Dashboard', to: '/' }, { label: 'Helpdesk & Employee Requests' }],
  '/tasks': [{ label: 'Dashboard', to: '/' }, { label: 'Task Management' }],
  '/expenses': [{ label: 'Dashboard', to: '/' }, { label: 'Expense Management' }],
  '/reports': [{ label: 'Dashboard', to: '/' }, { label: 'Reports' }],
  '/audit-logs': [{ label: 'Dashboard', to: '/' }, { label: 'Audit Logs' }],
  '/settings/security': [{ label: 'Dashboard', to: '/' }, { label: 'Settings' }, { label: 'Security' }],
  '/settings/email-templates': [{ label: 'Dashboard', to: '/' }, { label: 'Settings' }, { label: 'Email Templates' }],
  '/settings/employee-id': [{ label: 'Dashboard', to: '/' }, { label: 'Settings' }, { label: 'Employee ID Format' }],
  '/login': [{ label: 'Sign in' }],
  '/forgot-password': [{ label: 'Sign in', to: '/login' }, { label: 'Forgot password' }],
  '/reset-password': [{ label: 'Sign in', to: '/login' }, { label: 'Reset password' }],
  '/verify-email': [{ label: 'Sign in', to: '/login' }, { label: 'Verify email' }],
};

export function Breadcrumbs({ className = '' }: { className?: string }) {
  const { pathname } = useLocation();
  const fallbackLabel=pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-',' ').replace(/\b\w/g,letter=>letter.toUpperCase())||'Dashboard';
  const items = trails[pathname] ?? [{ label: 'Dashboard', to: '/' }, { label: fallbackLabel }];
  return <nav aria-label="Breadcrumb" className={`mb-2 ${className}`}>
    <ol className="flex flex-nowrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-1 whitespace-nowrap">
        {index > 0 && <ChevronRight aria-hidden="true" size={14}/>} 
        {item.to ? <Link to={item.to} className="inline-flex flex-nowrap items-center gap-1 whitespace-nowrap rounded hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40">
          {index === 0 && <Home aria-hidden="true" size={14}/>}<span className="whitespace-nowrap">{item.label}</span>
        </Link> : <span aria-current="page" className="inline-flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">{index === 0 && <Home aria-hidden="true" size={14}/>} {item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}
