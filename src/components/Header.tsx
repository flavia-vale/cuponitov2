import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const Header = () => (
  <header className="w-full bg-[#ff5200]">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-1 font-lexend font-bold text-white">
        <span className="text-2xl tracking-tight">cuponito<span className="text-orange-300">.</span></span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <Link to="/" className="text-sm font-semibold text-white/90 transition hover:text-white">
          Lojas
        </Link>
        <Link
          to="/blog"
          className="text-sm font-semibold text-white/90 transition hover:text-white"
        >
          Categorias
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button 
            variant="outline" 
            className="rounded-xl border-orange-400 bg-orange-600/20 px-6 font-bold text-white hover:bg-orange-600/40 hover:text-white"
          >
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
