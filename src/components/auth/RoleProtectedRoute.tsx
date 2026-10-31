import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminRole } from '@/hooks/useAdminRole';

interface RoleProtectedRouteProps {
  requiredRoles: AdminRole | AdminRole[];
  children: React.ReactNode;
}

export function RoleProtectedRoute({
  requiredRoles,
  children
}: RoleProtectedRouteProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const rolesKey = (Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]).join('|');
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    let cancelled = false;
    const required = rolesKey.split('|') as AdminRole[];
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!session) {
        navigateRef.current({ to: '/admin/login' });
        return;
      }

      const userRole = (session.user.user_metadata?.role as AdminRole) || null;

      const hasAccess = userRole === 'super_admin' || required.includes(userRole);

      if (!hasAccess) {
        navigateRef.current({ to: '/admin/access-denied' });
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
    return () => { cancelled = true; };
  }, [rolesKey]);

  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Verificando acesso...</div>;
  }

  return children;
}
