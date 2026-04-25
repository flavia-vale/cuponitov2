"use client";

import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Menu, ArrowLeft } from 'lucide-react';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab';
import { AdminStoresTab } from '@/components/admin/AdminStoresTab';
import { AdminSeoTab } from '@/components/admin/AdminSeoTab';
import { AdminCouponsTab } from '@/components/admin/AdminCouponsTab';
import { AdminIntegrationsTab } from '@/components/admin/AdminIntegrationsTab';
import { AdminCouponCategoriesTab } from '@/components/admin/AdminCouponCategoriesTab';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import type { Tables } from '@/integrations/supabase/types';

type Coupon = Tables<'coupons'>;

export default function AdminCouponsDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('cupons');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const navigate = useNavigate();
  const { data: stores, refetch: refetchStores } = useStoreBrands();

  useEffect(() => {
    const loadCoupons = async () => {
      const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      setCoupons(data || []);
    };
    loadCoupons();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate({ to: '/admin/login' }); };

  return (
    <RoleProtectedRoute requiredRoles={['coupon_admin', 'super_admin']}>
      <div className="flex min-h-screen bg-background">
        <button onClick={() => setSidebarOpen(true)} className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card md:hidden"><Menu className="h-4 w-4" /></button>
        <div className="hidden md:block"><AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} /></div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}><SheetContent side="left" className="w-56 p-0 md:hidden [&>button]:hidden"><AdminSidebar variant="mobile" activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} onLogout={handleLogout} /></SheetContent></Sheet>

        <main className="flex-1 overflow-auto md:ml-56">
          <div className="mx-auto max-w-5xl px-4 py-6 pt-14 md:pt-6">
            <Link to="/" className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/20">
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
            </Link>

            {activeTab === 'dashboard' && <AdminDashboardTab coupons={coupons} stores={stores} />}
            {activeTab === 'lojas' && <AdminStoresTab stores={stores} refetchStores={refetchStores} />}
            {activeTab === 'seo' && <AdminSeoTab />}
            {activeTab === 'cupons' && <AdminCouponsTab />}
            {activeTab === 'categorias' && <AdminCouponCategoriesTab />}
            {activeTab === 'integracoes' && <AdminIntegrationsTab />}
          </div>

        </main>
      </div>
    </RoleProtectedRoute>
  );
}
