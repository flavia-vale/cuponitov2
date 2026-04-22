import { Link } from '@tanstack/react-router';

const Footer = () => (
  <footer className="bg-[#1a1a1a] py-[30px] px-5 mt-10">
    <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
      <div>
        <div className="text-xl font-bold text-[#FF6B35] mb-2">cuponito.</div>
        <p className="text-xs text-[#666] leading-relaxed">
          O site de cupons de desconto mais confiável do Brasil. Todos os cupons são verificados diariamente pela nossa equipe.
        </p>
      </div>
      
      <div className="footer-col">
        <h5 className="text-xs font-bold text-white mb-3">Cuponito</h5>
        <div className="flex flex-col gap-1.5">
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Sobre nós</Link>
          <Link to="/blog" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Blog</Link>
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Contato</Link>
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Para lojas</Link>
        </div>
      </div>

      <div className="footer-col">
        <h5 className="text-xs font-bold text-white mb-3">Lojas populares</h5>
        <div className="flex flex-col gap-1.5">
          <Link to="/desconto/$slug" params={{ slug: 'amazon' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Amazon</Link>
          <Link to="/desconto/$slug" params={{ slug: 'shopee' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Shopee</Link>
          <Link to="/desconto/$slug" params={{ slug: 'shein' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">SHEIN</Link>
          <Link to="/desconto/$slug" params={{ slug: 'ifood' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">iFood</Link>
        </div>
      </div>

      <div className="footer-col">
        <h5 className="text-xs font-bold text-white mb-3">Ajuda</h5>
        <div className="flex flex-col gap-1.5">
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">FAQ</Link>
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Como usar cupons</Link>
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Privacidade</Link>
          <Link to="/" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Termos de uso</Link>
        </div>
      </div>
    </div>
    
    <div className="border-t border-[#333] mt-6 pt-4 text-center text-[11px] text-[#555]">
      © {new Date().getFullYear()} Cuponito · Todos os direitos reservados · Os preços e condições podem variar sem aviso prévio
    </div>
  </footer>
);

export default Footer;