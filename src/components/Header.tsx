import { Link } from '@tanstack/react-router';

const Header = () => (
  <header className="w-full bg-[#ff5200] sticky top-0 z-50 shadow-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-1 font-lexend font-bold text-white shrink-0">
        <span className="text-2xl tracking-tight">cuponito<span className="text-[#FFD166]">.</span></span>
      </Link>

      <nav className="flex items-center gap-2 md:gap-3 ml-auto">
        <Link 
          to="/" 
          hash="lojas"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
        >
          Lojas
        </Link>
        <Link 
          to="/" 
          hash="categorias"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
        >
          Categorias
        </Link>
        <Link
          to="/blog"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
        >
          Blog
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;