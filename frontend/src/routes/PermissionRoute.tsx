import type { ReactNode } from 'react'; import { Navigate } from 'react-router-dom'; import { useAppSelector } from '../app/hooks'; import type { Role } from '../types';
export function PermissionRoute({allowed,children}:{allowed:Role[];children:ReactNode}){const role=useAppSelector(state=>state.auth.user?.role);return role&&allowed.includes(role)?children:<Navigate to="/" replace/>}
