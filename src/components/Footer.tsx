import { Link } from '@tanstack/react-router';

const Footer = () => (
  <footer className="mt-10 bg-[#1a1a1a] px-5 py-[30px]">
    <div className="mx-auto max-w-[1100px] space-y-10">
      <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-2 text-xl font-bold text-[#FF6B35]">cuponito.</div>
          <p className="text-xs leading-relaxed text-[#8a8a8a]">
            O site de cupons de desconto mais confiável do Brasil. Todos os cupons são verificados diariamente pela nossa equipe.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="mb-3 text-xs font-bold text-white">Cuponito</h3>
          <div className="flex flex-col gap-1.5">
            <Link to="/quem-somos" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Quem somos nós</Link>
            <Link to="/blog" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Blog</Link>
            <Link to="/fale-conosco" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Fale conosco</Link>
            <Link to="/lojas" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Para lojas</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="mb-3 text-xs font-bold text-white">Lojas populares</h3>
          <div className="flex flex-col gap-1.5">
            <Link to="/desconto/$slug" params={{ slug: 'amazon' }} className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Amazon</Link>
            <Link to="/desconto/$slug" params={{ slug: 'shopee' }} className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Shopee</Link>
            <Link to="/desconto/$slug" params={{ slug: 'shein' }} className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">SHEIN</Link>
            <Link to="/desconto/$slug" params={{ slug: 'ifood' }} className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">iFood</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="mb-3 text-xs font-bold text-white">Ajuda</h3>
          <div className="flex flex-col gap-1.5">
            <Link to="/perguntas-frequentes" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Perguntas frequentes</Link>
            <Link to="/como-funciona" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Como funciona</Link>
            <Link to="/fale-conosco" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Contato</Link>
            <Link to="/" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Termos de uso</Link>
          </div>
        </div>
      </div>
    </div>

    <div className="mx-auto mt-6 max-w-[1100px] border-t border-[#333] pt-4 text-center text-[11px] text-[#666]">
      © {new Date().getFullYear()} Cuponito · Todos os direitos reservados · Os preços e condições podem variar sem aviso prévio
    </div>
  </footer>
);

export default Footer;
