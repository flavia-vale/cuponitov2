import { LayoutDashboard, Ticket, Store, Settings, LogOut, BookOpen, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AdminTab = 'dashboard' | 'cupons' | 'lojas' | 'blog' | 'seo' | 'integracoes';

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cupons', label: 'Cupons', icon: Ticket },
  { id: 'integracoes', label: 'Integrações', icon: Plug },
  { id: 'lojas', label: 'Lojas', icon: Store },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'seo', label: 'SEO & Config', icon: Settings },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  variant?: 'desktop' | 'mobile';
}

export function AdminSidebar({ activeTab, onTabChange, onLogout, variant = 'desktop' }: AdminSidebarProps) {
  return (
    <aside className={cn('flex flex-col border-r border-border bg-card', variant === 'desktop' ? 'fixed inset-y-0 left-0 z-30 w-56' : 'h-full w-full')}>
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">C</div>
        <span className="text-sm font-bold text-foreground">cuponito admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onTabChange(id)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', activeTab === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start gap-2 text-muted-foreground"><LogOut className="h-4 w-4" /> Sair</Button>
      </div>
    </aside>
  );
}