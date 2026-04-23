import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 'coupon_admin' | 'blog_admin' | 'super_admin';

interface UseAdminRoleResult {
  role: AdminRole | null;
  loading: boolean;
  hasAccess: (requiredRole: AdminRole | AdminRole[]) => boolean;
}

export function useAdminRole(): UseAdminRoleResult {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const userRole = (user.user_metadata?.role as AdminRole) || null;
      setRole(userRole);
      setLoading(false);
    };

    checkRole();
  }, []);

  const hasAccess = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!role) return false;
    if (role === 'super_admin') return true;

    const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return required.includes(role);
  };

  return { role, loading, hasAccess };
}
