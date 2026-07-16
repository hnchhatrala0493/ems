import { Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Link } from 'react-router-dom';

type ProfileTab =
  | 'overview'
  | 'personal'
  | 'employment'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'performance'
  | 'documents'
  | 'assets'
  | 'expenses'
  | 'tasks'
  | 'history';

const tabs: Array<{ key: ProfileTab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'personal', label: 'Personal Information' },
  { key: 'employment', label: 'Employment' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'performance', label: 'Performance' },
  { key: 'documents', label: 'Documents' },
  { key: 'assets', label: 'Assets' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'history', label: 'History' },
];

const summaryFields = [
  { label: 'Employee ID', key: 'employeeId' },
  { label: 'Designation', key: 'designation' },
  { label: 'Department', key: 'department' },
  { label: 'Work email', key: 'workEmail' },
  { label: 'Phone', key: 'phone' },
  { label: 'Reporting manager', key: 'reportingManager' },
  { label: 'Joining date', key: 'joiningDate' },
  { label: 'Employment status', key: 'employmentStatus' },
] as const;

export function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((item) => item[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SA';

  const profile = {
    profilePhoto: user?.profilePhoto,
    fullName: user?.name || 'Super Admin',
    employeeId: user?.employeeId || 'EMP-0001',
    designation: user?.designation || 'HR Manager',
    department: user?.department || 'Human Resources',
    workEmail: user?.email || 'admin@employeehub.local',
    phone: user?.phone || '+91 98765 43210',
    reportingManager: user?.reportingManager || 'John Doe',
    joiningDate: user?.joiningDate || 'January 1, 2024',
    employmentStatus: user?.status ? user.status.replaceAll('_', ' ') : 'Active',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <p className="text-sm text-slate-600">Overview gives a snapshot of the employee’s current profile, role, and recent activity.</p>;
      case 'personal':
        return <p className="text-sm text-slate-600">Personal information includes identity, contact, and home details for the selected employee.</p>;
      case 'employment':
        return <p className="text-sm text-slate-600">Employment details include joining, designation, department, and manager data.</p>;
      case 'attendance':
        return <p className="text-sm text-slate-600">Attendance shows the employee’s check-in, leave, and schedule history.</p>;
      case 'leave':
        return <p className="text-sm text-slate-600">Leave summarizes approved, pending, and available leave balances.</p>;
      case 'payroll':
        return <p className="text-sm text-slate-600">Payroll covers salary structure, deductions, and pay cycle information.</p>;
      case 'performance':
        return <p className="text-sm text-slate-600">Performance contains reviews, goals, ratings, and feedback history.</p>;
      case 'documents':
        return <p className="text-sm text-slate-600">Documents lists contracts, certificates, and compliance paperwork for the employee.</p>;
      case 'assets':
        return <p className="text-sm text-slate-600">Assets shows assigned devices, equipment, and inventory linked to the employee.</p>;
      case 'expenses':
        return <p className="text-sm text-slate-600">Expenses tracks submitted reimbursements and approvals for the employee.</p>;
      case 'tasks':
        return <p className="text-sm text-slate-600">Tasks displays active assignments, deadlines, and completed work.</p>;
      case 'history':
        return <p className="text-sm text-slate-600">History includes previous roles, promotions, transfers, and key profile changes.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2 md:px-4 lg:px-4">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employee Profile</h1>
          <p className="text-sm text-slate-500">Review and manage employee details across all core HR areas.</p>
        </div>
        <Link to="/settings/security" className="button">
          <ShieldCheck size={18} /> Security settings
        </Link>
      </div>

      <div className="mb-5 overflow-x-auto hide-scrollbar rounded-2xl border border-slate-200 bg-white/90 p-2">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-brand text-white shadow-lg shadow-brand/10'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-4">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.fullName} className="h-24 w-24 rounded-3xl object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-700 text-3xl font-bold text-white shadow-lg">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Employee summary</p>
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-sm text-slate-500">{profile.designation} • {profile.department}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {summaryFields.map((field) => (
                <div key={field.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{field.label}</p>
                  <p className="mt-2 font-semibold text-slate-900">{profile[field.key]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold capitalize">{tabs.find((tab) => tab.key === activeTab)?.label}</h3>
              <p className="text-sm text-slate-500">Detailed information for the selected employee tab.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {activeTab}
            </span>
          </div>
          <div className="space-y-4">
            {renderTabContent()}
            <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Content for this tab will appear here once the employee data is connected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
