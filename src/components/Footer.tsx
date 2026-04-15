import { Heart, Lock, Instagram, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const Footer = () => (
  <footer className="bg-[#121212] py-12 md:py-16 text-white/50">
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Coluna Logo */}
        <div className="space-y-4">
          <Link to="/" className="font-lexend text-2xl font-bold text-white">
            cuponito<span className="text-[#ff5200]">.</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Economize em todas as suas compras online com cupons verificados diariamente.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-[#ff5200] transition-colors"><Instagram size={20} /></a>
            <a href="mailto:contato@cuponito.com.br" className="text-white/40 hover:text-[#ff5200] transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Coluna Sobre */}
        <div>
          <h4 className="mb-5 text-sm font-black uppercase tracking-widest text-white/90">Sobre</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Quem somos</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog de Dicas</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Privacidade</Link></li>
          </ul>
        </div>

        {/* Coluna Contato */}
        <div>
          <h4 className="mb-5 text-sm font-black uppercase tracking-widest text-white/90">Contato</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trabalhe conosco</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Fale com o time</a></li>
          </ul>
        </div>

        {/* Coluna Lojas */}
        <div>
          <h4 className="mb-5 text-sm font-black uppercase tracking-widest text-white/90">Para Lojas</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Anunciar loja</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Afiliados</a></li>
            <li><Link to="/admin" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <Lock size={12} /> Painel Admin
            </Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 border-t border-white/5 pt-8 flex flex-col items-center gap-4 text-center">
        <p className="flex items-center gap-1.5 text-xs">
          Feito com <Heart size={14} className="fill-[#ff5200] text-[#ff5200]" /> no Brasil — Todos os direitos reservados.
        </p>
        <p className="text-[10px] text-white/20 max-w-md">
          Links de afiliado podem gerar comissões. Isso não altera o preço para você e ajuda a manter o Cuponito 100% gratuito.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;