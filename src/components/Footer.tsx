import { Link } from '@tanstack/react-router';

const Footer = () => (
  <footer className="bg-[#1a1a1a] py-[30px] px-5 mt-10">
    <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
      <div>
        <Link to="/" className="text-xl font-bold text-[#FF6B35] transition-colors hover:text-[#FF4D00]">cuponito.</Link>
      </div>
      
      <div className="footer-col">
        <h3 className="text-xs font-bold text-white mb-3">Cuponito</h3>
        <div className="flex flex-col gap-1.5">
          <Link to="/quem-somos" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Quem somos nós</Link>
          <Link to="/blog" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Blog</Link>
          <Link to="/fale-conosco" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Fale conosco</Link>
          <Link to="/lojas" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Para lojas</Link>
        </div>
      </div>

      <div className="footer-col">
        <h3 className="text-xs font-bold text-white mb-3">Lojas populares</h3>
        <div className="flex flex-col gap-1.5">
          <Link to="/desconto/$slug" params={{ slug: 'amazon' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Amazon</Link>
          <Link to="/desconto/$slug" params={{ slug: 'shopee' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Shopee</Link>
          <Link to="/desconto/$slug" params={{ slug: 'shein' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">SHEIN</Link>
          <Link to="/desconto/$slug" params={{ slug: 'ifood' }} className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">iFood</Link>
        </div>
      </div>

      <div className="footer-col">
        <h3 className="text-xs font-bold text-white mb-3">Ajuda</h3>
        <div className="flex flex-col gap-1.5">
          <Link to="/perguntas-frequentes" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Perguntas frequentes</Link>
          <Link to="/como-funciona" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Como funciona</Link>
          <Link to="/fale-conosco" className="text-xs text-[#666] hover:text-[#FF4D00] transition-colors">Contato</Link>
        </div>
      </div>
    </div>
    
    <div className="border-t border-[#333] mt-6 pt-4 text-center text-[11px] text-[#555]">
      © {new Date().getFullYear()} Cuponito · Todos os direitos reservados · Os preços e condições podem variar sem aviso prévio
    </div>
  </footer>
);

export default Footer;
