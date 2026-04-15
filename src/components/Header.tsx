import { Link } from '@tanstack/react-router';
import { Menu, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo à esquerda */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Menu className="h-4 w-4" />
          </div>
          <span className="text-sm sm:text-base">Cuponito</span>
        </Link>

        {/* Navegação central (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#lojas" className="text-sm font-medium text-muted-foreground transition hover:text-primary">
            Lojas
          </Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground transition hover:text-primary">
            Blog
          </Link>
          <a
            href="https://chat.whatsapp.com/KxLjSgr9xBi87F4zQxaT4C"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Grupo</span>
          </a>
        </nav>

        {/* Botão Entrar */}
        <div className="hidden md:block">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 hover:border-primary/40"
          >
            Entrar
          </Link>
        </div>

        {/* Menu hambúrguer (mobile) */}
        <button className="md:hidden flex items-center gap-2 text-muted-foreground">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;