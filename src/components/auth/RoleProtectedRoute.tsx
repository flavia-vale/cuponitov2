import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: '/admin/login' });
        return;
      }

      const userRole = (session.user.user_metadata?.role as AdminRole) || null;

      const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasAccess = userRole === 'super_admin' || required.includes(userRole);

      if (!hasAccess) {
        navigate({ to: '/admin/access-denied' });
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [navigate, requiredRoles]);

  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Verificando acesso...</div>;
  }

  return children;
}
