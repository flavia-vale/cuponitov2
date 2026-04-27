import { Link } from '@tanstack/react-router';

const Header = () => {
  return (
    <header className="w-full bg-[#FF4D00] sticky top-0 z-50 shadow-md h-[54px]">
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-1 font-bold text-white shrink-0 hover:opacity-90 transition-opacity">
          <span className="text-xl tracking-tight">cuponito<span className="text-[#FFD166]">.</span></span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 ml-4 sm:ml-8 text-[10px] sm:text-xs text-white/85">
          <Link to="/lojas" className="hover:text-white transition-colors font-medium">Lojas</Link>
          <Link to="/" hash="categorias" className="hover:text-white transition-colors font-medium">Categorias</Link>
          <Link
            to="/blog"
            className="bg-[#FFD166] text-[#1a1a1a] border-none rounded-[14px] px-[10px] py-1 font-black hover:bg-white transition-colors shadow-sm"
          >
            ✍ Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 ml-auto">
          {/* Busca removida daqui e movida para o Hero */}
        </div>
      </div>
    </header>
  );
};

export default Header;