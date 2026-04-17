import { Link } from '@tanstack/react-router';

const Header = () => (
  <header className="w-full bg-[#ff5200] sticky top-0 z-50 shadow-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-1 font-lexend font-bold text-white">
        <span className="text-2xl tracking-tight">cuponito<span className="text-[#FFD166]">.</span></span>
      </Link>

      <nav className="flex items-center gap-2 md:gap-4">
        <Link 
          to="/" 
          className="rounded-full px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
          activeProps={{ className: "bg-white/20" }}
        >
          Lojas
        </Link>
        <Link 
          to="/" 
          className="rounded-full px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
        >
          Categorias
        </Link>
        <Link
          to="/blog"
          className="rounded-full px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
          activeProps={{ className: "bg-white/20" }}
        >
          Blog
        </Link>
      </nav>

      {/* Espaçador para manter o alinhamento caso necessário no futuro */}
      <div className="hidden md:block w-[100px]" />
    </div>
  </header>
);

export default Header;