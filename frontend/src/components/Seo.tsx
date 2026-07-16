import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type PageSeo = { title: string; description: string; crumbs: string[]; index?: boolean };
const pages: Record<string, PageSeo> = {
  '/': { title: 'Dashboard', description: 'View your EmployeeHub workforce overview, metrics, and recent activity.', crumbs: ['Dashboard'] },
  '/employees': { title: 'Employees', description: 'Manage employee records and workforce information in EmployeeHub.', crumbs: ['Dashboard', 'Employees'] },
  '/employees/new': { title: 'Add Employee', description: 'Create a complete employee profile in EmployeeHub.', crumbs: ['Dashboard', 'Employees', 'Add Employee'] },
  '/employees/directory': { title: 'Employee Directory', description: 'Browse and find employees across the organization.', crumbs: ['Dashboard', 'Employees', 'Employee Directory'] },
  '/employees/history': { title: 'Employee History', description: 'Review employee lifecycle and profile change history.', crumbs: ['Dashboard', 'Employees', 'Employee History'] },
  '/employees/import': { title: 'Import Employees', description: 'Import employee records in bulk.', crumbs: ['Dashboard', 'Employees', 'Import Employees'] },
  '/organization': { title: 'Organization Management', description: 'Manage your organization profile, settings, and business structure.', crumbs: ['Dashboard', 'Organization'] },
  '/masters': { title: 'Departments and Designations', description: 'Manage departments, designations, teams, levels, grades, and organization masters.', crumbs: ['Dashboard', 'Departments & Masters'] },
  '/attendance': { title: 'Attendance Management', description: 'Manage check-ins, work hours, attendance corrections, approvals, and rules.', crumbs: ['Dashboard', 'Attendance'] },
  '/shifts': { title: 'Shift Management', description: 'Manage work shifts, assignments, rotations, calendars, and overtime rules.', crumbs: ['Dashboard', 'Shifts'] },
  '/leaves': { title: 'Leave Management', description: 'Manage leave policies, balances, applications, and approval workflows.', crumbs: ['Dashboard', 'Leave Management'] },
  '/holidays': { title: 'Holiday Calendar', description: 'Manage organization, branch, location, and optional holidays.', crumbs: ['Dashboard', 'Holiday Calendar'] },
  '/payroll': { title: 'Payroll Management', description: 'Configure salary structures, process payroll, and publish payslips.', crumbs: ['Dashboard', 'Payroll'] },
  '/performance': { title: 'Performance Management', description: 'Manage review cycles, goals, ratings, feedback, and improvement plans.', crumbs: ['Dashboard', 'Performance'] },
  '/recruitment': { title: 'Recruitment Management', description: 'Manage job openings, candidates, interviews, offers, and hiring.', crumbs: ['Dashboard', 'Recruitment'] },
  '/onboarding': { title: 'Employee Onboarding', description: 'Manage onboarding templates, checklists, probation, and confirmation.', crumbs: ['Dashboard', 'Onboarding'] },
  '/profile': { title: 'My Profile', description: 'View your EmployeeHub profile and account information.', crumbs: ['Dashboard', 'My Profile'] },
  '/offboarding': { title: 'Employee Offboarding', description: 'Manage resignations, notice periods, clearances, settlements, and exit letters.', crumbs: ['Dashboard', 'Offboarding'] },
  '/documents': { title: 'Document Management', description: 'Manage secure employee documents, approvals, versions, access, and expiry.', crumbs: ['Dashboard', 'Documents'] },
  '/assets': { title: 'Asset Management', description: 'Manage organization assets and employee assignments.', crumbs: ['Dashboard', 'Assets'] },
  '/roles': { title: 'Roles and Permissions', description: 'Manage system and custom roles, permissions, priorities, and user assignments.', crumbs: ['Dashboard', 'Roles & Permissions'] },
  '/modules': { title: 'Dynamic Modules', description: 'Configure application modules and permission actions.', crumbs: ['Dashboard', 'Roles & Permissions', 'Dynamic Modules'] },
  '/notifications': { title: 'Notifications', description: 'Manage real-time EmployeeHub updates and notification preferences.', crumbs: ['Dashboard', 'Notifications'] },
  '/announcements': { title: 'Announcements', description: 'View and manage company announcements, events, policies, and updates.', crumbs: ['Dashboard', 'Announcements'] },
  '/helpdesk': { title: 'Helpdesk and Employee Requests', description: 'Submit and track employee support requests and helpdesk tickets.', crumbs: ['Dashboard', 'Helpdesk & Employee Requests'] },
  '/tasks': { title: 'Task Management', description: 'Assign, track, and complete employee tasks.', crumbs: ['Dashboard', 'Task Management'] },
  '/expenses': { title: 'Expense Management', description: 'Submit, approve, and reimburse employee expense claims.', crumbs: ['Dashboard', 'Expense Management'] },
  '/reports': { title: 'Reports', description: 'Generate workforce, attendance, payroll and compliance reports.', crumbs: ['Dashboard', 'Reports'] },
  '/audit-logs': { title: 'Audit Logs', description: 'Review security and operational activity across EmployeeHub.', crumbs: ['Dashboard', 'Audit Logs'] },
  '/settings/security': { title: 'Security Settings', description: 'Manage your EmployeeHub account security and active sessions.', crumbs: ['Dashboard', 'Settings', 'Security'] },
  '/settings/email-templates': { title: 'Email Templates', description: 'Customize EmployeeHub transactional email templates and placeholders.', crumbs: ['Dashboard', 'Settings', 'Email Templates'] },
  '/settings/employee-id': { title: 'Employee ID Format', description: 'Configure automatic employee ID formats and sequences.', crumbs: ['Dashboard', 'Settings', 'Employee ID Format'] },
  '/login': { title: 'Sign In', description: 'Sign in securely to your EmployeeHub account.', crumbs: ['Sign In'], index: true },
  '/forgot-password': { title: 'Forgot Password', description: 'Request a secure password reset link for your EmployeeHub account.', crumbs: ['Sign In', 'Forgot Password'], index: true },
  '/reset-password': { title: 'Reset Password', description: 'Choose a new password for your EmployeeHub account.', crumbs: ['Sign In', 'Reset Password'] },
  '/verify-email': { title: 'Verify Email', description: 'Verify the email address associated with your EmployeeHub account.', crumbs: ['Verify Email'] },
};
const paths: Record<string, string> = { Dashboard: '/', Employees: '/employees', 'Add Employee': '/employees/new', Organization: '/organization', Settings: '/settings/security', Security: '/settings/security', 'Sign In': '/login', 'Forgot Password': '/forgot-password', 'Reset Password': '/reset-password', 'Verify Email': '/verify-email' };

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) { element = document.createElement('meta'); document.head.appendChild(element); }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

export function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pages[pathname] ?? { title: 'Page Not Found', description: 'The requested EmployeeHub page could not be found.', crumbs: ['Page Not Found'] };
    const origin = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || window.location.origin;
    const canonical = `${origin}${pathname === '/' ? '/' : pathname}`;
    const fullTitle = `${page.title} | EmployeeHub`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', { name: 'description', content: page.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: page.index ? 'index, follow' : 'noindex, nofollow' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: page.description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'EmployeeHub' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: page.description });
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
    const schema = document.createElement('script');
    schema.type = 'application/ld+json'; schema.dataset.seo = 'breadcrumbs';
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: page.crumbs.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name, item: `${origin}${paths[name] ?? pathname}` })) });
    document.head.querySelector('script[data-seo="breadcrumbs"]')?.remove();
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [pathname]);
  return null;
}
