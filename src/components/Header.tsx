import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';

const Header = () => (
  <header className="w-full bg-[#FF4D00] sticky top-0 z-50 shadow-md h-[54px]">
    <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-5">
      <Link to="/" className="flex items-center gap-1 font-bold text-white shrink-0">
        <span className="text-xl tracking-tight">cuponito<span className="text-[#FFD166]">.</span></span>
      </Link>

      <nav className="hidden md:flex items-center gap-5 ml-8 text-xs text-white/85">
        <Link to="/lojas" className="hover:text-white transition-colors">Lojas</Link>
        <Link to="/" hash="categorias" className="hover:text-white transition-colors">Categorias</Link>
        <Link
          to="/blog"
          className="bg-white/15 border border-white/30 rounded-[14px] px-[11px] py-1 text-[#FFD166] font-semibold hover:text-white transition-colors"
        >
          ✍ Blog
        </Link>
      </nav>

      <div className="flex items-center gap-2.5 ml-auto">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Buscar loja ou cupom..." 
            className="bg-white/20 border border-white/30 rounded-[20px] px-3.5 py-1.5 text-xs text-white/80 placeholder:text-white/60 outline-none w-[180px] focus:bg-white/30 transition-all"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
        </div>
      </div>
    </div>
  </header>
);

export default Header;