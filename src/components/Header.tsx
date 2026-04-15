import { Link } from '@tanstack/react-router';
import { Menu, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-4">
        {/* Lado esquerdo: Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Menu className="h-4 w-4" />
          </div>
          <span className="text-sm sm:text-base">Cupons de Desconto</span>
        </Link>

        {/* Centro: Navegação (mobile: hambúrguer) */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/#lojas" className="text-sm font-medium text-foreground transition hover:bg-muted hover:text-foreground">
            Lojas
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary">
            Blog
          </Link>
          <a
            href="https://chat.whatsapp.com/KxLjSgr9xBi87F4zQxaT4C"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Grupo
          </a>
        </nav>

        {/* Mobile: Hambúrguer */}
        <button 
          className="hidden md:hidden flex items-center gap-2 text-primary font-medium text-foreground"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;