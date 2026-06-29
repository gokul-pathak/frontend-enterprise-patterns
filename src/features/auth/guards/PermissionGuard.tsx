'use client';

import { useAppSelector } from '@/store';
import type { UserRole } from '../types/auth.types';

interface PermissionGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Role-based rendering guard.
 *
 * Renders children only if the authenticated user's role is in allowedRoles.
 * This is a UI guard — it controls rendering, not access.
 * Server-side authorization (API-level) is enforced by the backend.
 *
 * Usage:
 *   <PermissionGuard allowedRoles={['admin']}>
 *     <DeleteUserButton />
 *   </PermissionGuard>
 */
export function PermissionGuard({
  children,
  allowedRoles,
  fallback = null,
}: PermissionGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
