import { Award, Banknote, Bell, BriefcaseBusiness, Building2, CalendarCheck, CalendarOff, ChevronDown, ChevronRight, ClipboardCheck, Clock3, FileArchive, LayoutDashboard, Layers3, LogOut, Menu, Moon, Package, PanelLeftClose, Search, Settings, ShieldCheck, UserCircle, UserMinus, Users, X, type LucideIcon } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { signedOut, type RootState } from '../store';
import type { Role } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { HolidayWidget } from './HolidayWidget';
import { LiveAttendanceTimer } from './LiveAttendanceTimer';

type SidebarItem = { label: string; path?: string; icon?: LucideIcon; roles?: Role[]; children?: SidebarItem[] };

const menu: SidebarItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Book Demo Requests', path: '/super-admin/demo-requests', icon: CalendarCheck, roles: ['SUPER_ADMIN'] },
  { label: 'Employees', icon: Users, children: [
    { label: 'All Employees', path: '/employees' },
    { label: 'Add Employee', path: '/employees/new' },
    { label: 'Employee Directory', path: '/employees/directory' },
    { label: 'Employee History', path: '/employees/history' },
    { label: 'Import Employees', path: '/employees/import' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER'] },
  { label: 'Organization', icon: Building2, children: [
    { label: 'Departments', path: '/masters' },
    { label: 'Designations', path: '/masters' },
    { label: 'Teams', path: '/masters' },
    { label: 'Branches', path: '/organization' },
    { label: 'Locations', path: '/organization' },
    { label: 'Job Levels', path: '/masters' },
    { label: 'Cost Centers', path: '/organization' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'] },
  { label: 'Attendance', icon: CalendarCheck, children: [
    { label: 'Verified Check-In', path: '/attendance/check-in' },
    { label: 'Check-In Settings', path: '/attendance/settings', roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN'] },
    { label: 'Daily Attendance', path: '/attendance' },
    { label: 'Monthly Attendance', path: '/attendance/monthly' },
    { label: 'Attendance Calendar', path: '/attendance' },
    { label: 'Attendance Requests', path: '/attendance' },
    { label: 'Manual Attendance', path: '/attendance' },
    { label: 'Attendance Reports', path: '/attendance/monthly' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'EMPLOYEE'] },
  { label: 'Shifts', icon: Clock3, children: [
    { label: 'Shift List', path: '/shifts' },
    { label: 'Shift Assignments', path: '/shifts' },
    { label: 'Shift Rotation', path: '/shifts' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER'] },
  { label: 'Leave', icon: CalendarOff, children: [
    { label: 'My Leave', path: '/leaves' },
    { label: 'Leave Requests', path: '/leaves' },
    { label: 'Leave Calendar', path: '/leaves' },
    { label: 'Leave Balance', path: '/leaves' },
    { label: 'Leave Types', path: '/leaves' },
    { label: 'Leave Policies', path: '/leaves' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'EMPLOYEE'] },
  { label: 'Payroll', icon: Banknote, children: [
    { label: 'Salary Structures', path: '/payroll?view=structures' },
    { label: 'Employee Salaries', path: '/payroll?view=assignments' },
    { label: 'Payroll Processing', path: '/payroll?view=runs' },
    { label: 'Payslips', path: '/payroll?view=runs' },
    { label: 'Bonuses', path: '/payroll?view=components' },
    { label: 'Deductions', path: '/payroll?view=components' },
    { label: 'Loans', path: '/payroll?view=components' },
    { label: 'Payroll Reports', path: '/reports?category=Payroll' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'PAYROLL_MANAGER', 'FINANCE_USER'] },
  { label: 'Performance', icon: Award, children: [
    { label: 'Review Cycles', path: '/performance' },
    { label: 'Goals', path: '/performance' },
    { label: 'Reviews', path: '/performance' },
    { label: 'Feedback', path: '/performance' },
    { label: 'Performance Reports', path: '/performance' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER'] },
  { label: 'Recruitment', icon: BriefcaseBusiness, children: [
    { label: 'Job Openings', path: '/recruitment' },
    { label: 'Candidates', path: '/recruitment' },
    { label: 'Interviews', path: '/recruitment' },
    { label: 'Offers', path: '/recruitment' },
    { label: 'Recruitment Reports', path: '/recruitment' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'RECRUITER'] },
  { label: 'Onboarding', path: '/onboarding', icon: ClipboardCheck, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'] },
  { label: 'Offboarding', path: '/offboarding', icon: UserMinus, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'] },
  { label: 'Documents', path: '/documents', icon: FileArchive, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE'] },
  { label: 'Assets', path: '/assets', icon: Package, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER'] },
  { label: 'Expenses', path: '/expenses', icon: Banknote, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'PAYROLL_MANAGER', 'FINANCE_USER', 'EMPLOYEE'] },
  { label: 'Tasks', path: '/tasks', icon: ClipboardCheck, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'PAYROLL_MANAGER', 'RECRUITER', 'FINANCE_USER', 'EMPLOYEE'] },
  { label: 'Announcements', path: '/announcements', icon: Bell, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'PAYROLL_MANAGER', 'RECRUITER', 'FINANCE_USER', 'EMPLOYEE'] },
  { label: 'Helpdesk', path: '/helpdesk', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'DEPARTMENT_MANAGER', 'TEAM_LEADER', 'PAYROLL_MANAGER', 'RECRUITER', 'FINANCE_USER', 'EMPLOYEE'] },
  { label: 'Reports', path: '/reports', icon: Layers3, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'PAYROLL_MANAGER', 'FINANCE_USER'] },
  { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN'] },
  { label: 'Roles & Permissions', icon: ShieldCheck, children: [
    { label: 'Dynamic Modules', path: '/modules' },
    { label: 'Roles', path: '/roles?view=roles' },
    { label: 'Permission Matrix', path: '/roles?view=matrix' },
    { label: 'User Role Assignment', path: '/roles?view=assignment' },
    { label: 'Permission Overrides', path: '/roles?view=overrides' },
    { label: 'Access Review', path: '/roles?view=review' },
    { label: 'Assignment History', path: '/roles?view=history' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN'] },
  { label: 'Settings', icon: Settings, children: [
    { label: 'Security & Sessions', path: '/settings/security' },
    { label: 'Employee ID Format', path: '/settings/employee-id' },
    { label: 'Email Templates', path: '/settings/email-templates' }
  ], roles: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'HR_ADMIN'] }
];

export function Layout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { pathname, search } = useLocation();

  const role = user?.role || 'EMPLOYEE';
  const visibleMenu = useMemo(
    () =>
      menu
        .filter((item) => !item.roles || item.roles.includes(role as Role))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => !child.roles || child.roles.includes(role as Role)),
        })),
    [role]
  );

  useEffect(() => {
    const currentGroup = visibleMenu.find((item) =>
      item.children?.some((child) => child.path && (pathname === child.path || pathname.startsWith(`${child.path}/`)))
    );
    if (currentGroup?.label) {
      setOpenGroups((previous) => ({ ...previous, [currentGroup.label]: true }));
    }
  }, [pathname, visibleMenu]);

  const isActive = (path?: string) => {
    if (!path) return false;
    const [targetPath, targetSearch] = path.split('?');
    const pathMatches = targetPath === '/' ? pathname === '/' : pathname === targetPath || pathname.startsWith(`${targetPath}/`);
    return pathMatches && (!targetSearch || search === `?${targetSearch}`);
  };
  const toggleGroup = (label: string) => setOpenGroups((previous) => ({ ...previous, [label]: !previous[label] }));

  const sidebar = (
    <aside
      className={`flex h-screen ${collapsed ? 'w-20' : 'w-72'} max-w-[86vw] flex-col overflow-hidden border-r border-white/10 bg-navy px-3 py-4 text-white xl:px-4`}
    >
      <div className="shrink-0 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''} text-lg font-bold tracking-tight`}>
            <span className="rounded-xl bg-brand p-2 text-white shadow-lg shadow-brand/20">
              <Building2 size={21} />
            </span>
            {!collapsed && <span>EmployeeHub</span>}
          </div>
          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden">
            <X size={21} />
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/10 p-3 text-xs text-slate-300">
        <p className="font-semibold text-white">{role.replaceAll('_', ' ')}</p>
        {!collapsed && <p className="mt-1 text-[11px] text-slate-300/80">Access your workspace, reports, and operations.</p>}
      </div>
      <nav className="sidebar-scrollbar mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 pb-2">
        {visibleMenu.map((item) => {
          const hasChildren = !!item.children?.length;
          const groupOpen = !!openGroups[item.label];
          const active = item.path ? isActive(item.path) : !!item.children?.some((child) => isActive(child.path));

          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    active ? 'bg-white/15 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon ? <item.icon className="shrink-0" size={17} /> : <Users className="shrink-0" size={17} />}
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && <span>{groupOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>}
                </button>
                {groupOpen && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {item.children!.map((child) => {
                      const childActive = isActive(child.path);
                      return (
                        <button
                          key={`${item.label}-${child.label}`}
                          onClick={() => {
                            setOpen(false);
                            if (child.path && child.path !== '#') navigate(child.path);
                          }}
                          className={`flex w-full items-center rounded-2xl px-2 py-2 text-left text-sm transition ${
                            childActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                if (item.path && item.path !== '#') navigate(item.path);
              }}
              className={`flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-white/15 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                {item.icon ? <item.icon className="shrink-0" size={17} /> : <LayoutDashboard className="shrink-0" size={17} />}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] lg:flex">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open && (
        <>
          <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}</div>
        </>
      )}
      <main className={`min-w-0 flex-1 overflow-auto ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <header className="sticky-top z-20 flex h-[72px] items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur md:px-6 lg:px-7 xl:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setOpen(true)} className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden">
              <Menu />
            </button>
            <button aria-label="Collapse sidebar" onClick={() => setCollapsed((value) => !value)} className="hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:inline-flex">
              <PanelLeftClose className="h-5 w-5" />
            </button>
            <div className="hidden rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm sm:flex items-center gap-3">
              <span className="rounded-2xl bg-brand/10 p-2 text-brand">
                <Search size={18} />
              </span>
              <input type="search" placeholder="Search everything..." className="input border-none bg-transparent px-0 py-0 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveAttendanceTimer />
            <button onClick={() => setSearchOpen(!searchOpen)} className="icon-btn lg:hidden" aria-label="Open search">
              <Search />
            </button>
            <button className="icon-btn relative" onClick={() => { setCalendarOpen(!calendarOpen); setNotificationsOpen(false); }} aria-label="Organization calendar" title="Organization calendar">
              <CalendarCheck />
            </button>
            <button className="icon-btn relative" onClick={() => { setNotificationsOpen(!notificationsOpen); setCalendarOpen(false); }} aria-label="Notifications">
              <Bell />
              <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button className="icon-btn" aria-label="Toggle dark mode" onClick={()=>{const dark=!document.documentElement.classList.contains('dark');document.documentElement.classList.toggle('dark',dark);localStorage.setItem('employeehub-theme',dark?'dark':'light')}}>
              <Moon />
            </button>
            <div className="relative">
              <button aria-label="Open user profile menu" aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-violet-600 text-sm font-bold text-white">
                  {user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || <UserCircle size={20} />}
                </span>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Guest User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role.replaceAll('_', ' ').toLowerCase()}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <div className="space-y-1 p-3">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="block rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">My profile</Link>
                    <button onClick={() => setConfirmSignOut(true)} className="block w-full rounded-2xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10">Sign out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {searchOpen && (
          <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm lg:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Search everything..." className="input w-full pl-12 pr-4" />
            </div>
          </div>
        )}

        {notificationsOpen && (
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 shadow-sm lg:absolute lg:right-0 lg:top-20 lg:w-[26rem] lg:rounded-3xl lg:border lg:bg-white lg:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-sm text-slate-500">Latest alerts and workflow updates.</p>
              </div>
              <button onClick={() => setNotificationsOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {['Payroll needs review', 'New candidate interview', 'System maintenance at 8 PM'].map((message, index) => (
                <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">{message}</p>
                  <p className="mt-1 text-xs text-slate-500">{index === 0 ? 'High priority' : index === 1 ? 'Scheduled interview' : 'Maintenance notice'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {calendarOpen && (
          <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm lg:absolute lg:right-16 lg:top-20 lg:z-50 lg:w-[26rem] lg:rounded-3xl lg:border lg:shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-sm font-semibold text-slate-900">Organization calendar</p><p className="text-xs text-slate-500">Upcoming holidays across locations</p></div>
              <button onClick={() => setCalendarOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18}/></button>
            </div>
            <HolidayWidget compact={false} title="Upcoming holidays" />
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-auto bg-[var(--background)] px-4 pb-20 pt-5 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1680px] space-y-5 page-enter">
            <div className="mb-1 flex items-center justify-between gap-4"><Breadcrumbs />{pathname==='/employees/new'&&<Link to="/employees" className="small-button inline-flex shrink-0 items-center gap-2"><ChevronRight className="rotate-180" size={17}/>Back</Link>}</div>
            <div className="space-y-6">
              <Outlet />
            </div>
          </div>
        </main>

        {confirmSignOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="signout-title">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-950">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                <LogOut size={25} />
              </span>
              <h2 id="signout-title" className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">Sign out of EmployeeHub?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">You will need to enter your credentials again to access your account.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmSignOut(false)} className="rounded-2xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                <button onClick={() => dispatch(signedOut())} className="rounded-2xl bg-rose-600 px-4 py-2.5 font-semibold text-white hover:bg-rose-700">Sign out</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
