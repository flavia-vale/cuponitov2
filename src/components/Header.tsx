import { Link } from '@tanstack/react-router';

const Header = () => {
  return (
    <header className="w-full bg-[#FF4D00] sticky top-0 z-50 shadow-md h-[54px]">
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-1 font-bold text-white shrink-0 hover:opacity-90 transition-opacity">
          <span className="text-xl tracking-tight">cuponito<span className="text-[#FFD166]">.</span></span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 ml-4 sm:ml-8 text-[10px] sm:text-xs">
          <Link
            to="/lojas"
            className="flex items-center gap-1.5 px-2 py-1 rounded text-white/[0.88] font-medium hover:bg-white/15 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Lojas
          </Link>
          <Link
            to="/"
            hash="categorias"
            className="flex items-center gap-1.5 px-2 py-1 rounded text-white/[0.88] font-medium hover:bg-white/15 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Categorias
          </Link>
          <Link
            to="/blog"
            className="flex items-center gap-1.5 bg-white text-[#FF5500] rounded-[8px] px-[15px] py-[7px] font-semibold hover:bg-white/[0.92] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
            Blog
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