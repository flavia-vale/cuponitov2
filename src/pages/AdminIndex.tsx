"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export default function AdminIndex() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: '/admin/login' });
        return;
      }

      const role = session.user.user_metadata?.role as string;

      if (role === 'coupon_admin' || role === 'super_admin') {
        navigate({ to: '/admin/coupons' });
      } else if (role === 'blog_admin') {
        navigate({ to: '/admin/blog' });
      } else {
        navigate({ to: '/admin/access-denied' });
      }

      setLoading(false);
    };

    redirect();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Redirecionando...
    </div>
  );
}
