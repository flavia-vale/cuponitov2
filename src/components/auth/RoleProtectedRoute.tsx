import { useNavigate, useLocation } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminRole } from '@/hooks/useAdminRole';

interface RoleProtectedRouteProps {
  requiredRoles: AdminRole | AdminRole[];
  children: React.ReactNode;
  fallbackTo?: string;
}

export function RoleProtectedRoute({
  requiredRoles,
  children,
  fallbackTo = '/admin/login'
}: RoleProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: fallbackTo });
        return;
      }

      const user = session.user;
      const userRole = (user.user_metadata?.role as AdminRole) || null;

      if (!userRole) {
        navigate({ to: '/admin/access-denied' });
        return;
      }

      const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasAccess = userRole === 'super_admin' || required.includes(userRole);

      if (!hasAccess) {
        navigate({ to: '/admin/access-denied' });
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [location, navigate, requiredRoles, fallbackTo]);

  if (isAuthorized === null) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Verificando acesso...</div>;
  }

  return isAuthorized ? children : null;
}
