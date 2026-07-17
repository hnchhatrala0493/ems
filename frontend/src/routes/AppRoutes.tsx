import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Layout } from '../components/Layout';
import { Dashboard } from '../pages/Dashboard';
import { Employees } from '../pages/Employees';
import { EmployeeCreate } from '../pages/EmployeeCreate';
import { EmployeeDirectory } from '../pages/EmployeeDirectory';
import { EmployeeHistory } from '../pages/EmployeeHistory';
import { EmployeeImport } from '../pages/EmployeeImport';
import { Organization } from '../pages/Organization';
import { Masters } from '../pages/Masters';
import { Attendance } from '../pages/Attendance';
import { VerifiedCheckIn } from '../pages/VerifiedCheckIn';
import { AttendanceSettings } from '../pages/AttendanceSettings';
import { MonthlyAttendance } from '../pages/MonthlyAttendance';
import { Shifts } from '../pages/Shifts';
import { Leaves } from '../pages/Leaves';
import { Holidays } from '../pages/Holidays';
import { Payroll } from '../pages/Payroll';
import { Performance } from '../pages/Performance';
import { Recruitment } from '../pages/Recruitment';
import { Onboarding } from '../pages/Onboarding';
import { Profile } from '../pages/Profile';
import { Offboarding } from '../pages/Offboarding';
import { Documents } from '../pages/Documents';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { Security } from '../pages/settings/Security';
import { EmployeeIdSettings } from '../pages/settings/EmployeeIdSettings';
import { Assets } from '../pages/Assets';
import { Roles } from '../pages/Roles';
import { Notifications } from '../pages/Notifications';
import { Reports } from '../pages/Reports';
import { EmailTemplates } from '../pages/EmailTemplates';
import { AuditLogs } from '../pages/AuditLogs';
import { Modules } from '../pages/Modules';
import { Announcements } from '../pages/Announcements';
import { Helpdesk } from '../pages/Helpdesk';
import { Tasks } from '../pages/Tasks';
import { Expenses } from '../pages/Expenses';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionRoute } from './PermissionRoute';
import { DemoRequests } from '../pages/DemoRequests';
import { DemoRequestDetails } from '../pages/DemoRequestDetails';

function PublicPage({ children }: { children: ReactNode }) {
  return <div className="relative">
    <div className="absolute left-6 top-5 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur lg:left-auto lg:right-8">
      <Breadcrumbs className="mb-0"/>
    </div>
    {children}
  </div>;
}

export function AppRoutes() {
  const token = useAppSelector(state => state.auth.token);
  return <Routes>
    <Route path="/login" element={token ? <Navigate to="/" replace/> : <PublicPage><Login/></PublicPage>}/>
    <Route path="/forgot-password" element={<PublicPage><ForgotPassword/></PublicPage>}/>
    <Route path="/reset-password" element={<PublicPage><ResetPassword/></PublicPage>}/>
    <Route path="/verify-email" element={<PublicPage><VerifyEmail/></PublicPage>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="employees" element={<Employees/>}/>
        <Route path="employees/new" element={<EmployeeCreate/>}/>
        <Route path="employees/directory" element={<EmployeeDirectory/>}/>
        <Route path="employees/history" element={<EmployeeHistory/>}/>
        <Route path="employees/import" element={<EmployeeImport/>}/>
        <Route path="organization" element={<Organization/>}/>
        <Route path="masters" element={<Masters/>}/>
        <Route path="attendance" element={<Attendance/>}/>
        <Route path="attendance/check-in" element={<VerifiedCheckIn/>}/>
        <Route path="attendance/settings" element={<AttendanceSettings/>}/>
        <Route path="attendance/monthly" element={<MonthlyAttendance/>}/>
        <Route path="shifts" element={<Shifts/>}/>
        <Route path="leaves" element={<Leaves/>}/>
        <Route path="holidays" element={<Holidays/>}/>
        <Route path="payroll" element={<Payroll/>}/>
        <Route path="performance" element={<Performance/>}/>
        <Route path="recruitment" element={<Recruitment/>}/>
        <Route path="onboarding" element={<Onboarding/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="offboarding" element={<Offboarding/>}/>
        <Route path="documents" element={<Documents/>}/>
        <Route path="assets" element={<Assets/>}/>
        <Route path="roles" element={<Roles/>}/>
        <Route path="modules" element={<Modules/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="announcements" element={<Announcements/>}/>
        <Route path="helpdesk" element={<Helpdesk/>}/>
        <Route path="tasks" element={<Tasks/>}/>
        <Route path="expenses" element={<Expenses/>}/>
        <Route path="reports" element={<Reports/>}/>
        <Route path="settings/email-templates" element={<EmailTemplates/>}/>
        <Route path="audit-logs" element={<AuditLogs/>}/>
        <Route path="settings/security" element={<Security/>}/>
        <Route path="settings/employee-id" element={<EmployeeIdSettings/>}/>
        <Route path="super-admin/demo-requests" element={<PermissionRoute allowed={['SUPER_ADMIN']}><DemoRequests/></PermissionRoute>}/>
        <Route path="super-admin/demo-requests/:id" element={<PermissionRoute allowed={['SUPER_ADMIN']}><DemoRequestDetails/></PermissionRoute>}/>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace/>}/>
  </Routes>;
}
