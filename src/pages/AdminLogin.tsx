"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const role = session.user.user_metadata?.role as string;
        if (role === 'coupon_admin' || role === 'super_admin') navigate({ to: '/admin/coupons' });
        else if (role === 'blog_admin') navigate({ to: '/admin/blog' });
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = session.user.user_metadata?.role as string;
        if (role === 'coupon_admin' || role === 'super_admin') navigate({ to: '/admin/coupons' });
        else if (role === 'blog_admin') navigate({ to: '/admin/blog' });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) toast({ title: 'Erro de autenticação', description: error.message, variant: 'destructive' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SEOHead title="Admin Login | Cuponito" description="Login administrativo" jsonLdRoute={{ type: 'generic' }} />
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div>
          <h1 className="text-xl font-bold text-card-foreground">Admin</h1>
        </div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Senha</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </div>
  );
}
