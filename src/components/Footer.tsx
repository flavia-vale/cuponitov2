import { Link } from '@tanstack/react-router';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-foreground py-16 text-white/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
              cuponito<span className="text-accent">.</span>
            </Link>
            <p className="text-sm leading-relaxed">
              O amigo brasileiro que entende de economia. Publicamos apenas cupons verificados das maiores lojas do país.
            </p>
          </div>
          
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-white">Navegação</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Página Inicial</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog de Dicas</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Todas as Lojas</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Área Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-white">Categorias</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Eletrônicos</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Moda e Acessórios</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Casa e Decoração</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Beleza e Saúde</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-white">Contato</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>{settings?.global_links.contact_email || 'contato@cuponito.com.br'}</li>
              <li><Link to="/" className="text-primary hover:underline">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-[10px] font-bold uppercase tracking-widest">
          &copy; {year} cuponito. — feito com carinho para quem quer economizar.
        </div>
      </div>
    </footer>
  );
}
