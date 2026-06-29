'use client';

import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  
  // For portfolio purposes, all GitHub OAuth users are granted 'admin' access
  // so they can see all UI elements.
  const userRole: UserRole = session?.user ? 'admin' : 'employee';

  if (!session?.user || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
