import { Link } from '@tanstack/react-router';

const howItWorksSteps = [
  'Busque a loja onde você quer comprar',
  'Escolha o cupom ou a oferta que mais te interessa',
  'Clique em "copiar código" e cole no carrinho da loja na hora de fechar o pedido.',
  'Pronto, o desconto já aparece!',
];

const faqs = [
  {
    question: 'Por que meu cupom não funcionou?',
    answer:
      'A maioria dos cupons têm regras: valor mínimo de compra, produto específico, prazo de validade ou limite de uso por CPF. A gente sempre tenta deixar isso claro na descrição.',
  },
  {
    question: 'Preciso me cadastrar para usar os cupons?',
    answer: 'Não. Nenhum cadastro, nenhuma assinatura, nenhum custo. É só clicar e copiar.',
  },
  {
    question: 'O cuponito cobra alguma coisa?',
    answer:
      'Nunca. O site é 100% gratuito pra você. A gente recebe uma comissão das lojas quando uma compra é finalizada, sem nenhum custo adicional para quem compra.',
  },
  {
    question: 'Com que frequência os cupons são atualizados?',
    answer:
      'Todo dia. A equipe verifica os cupons ativos e remove os que venceram. Se você encontrar um que não funciona, fique a vontade para avisar a gente.',
  },
  {
    question: 'Posso sugerir uma loja ou um cupom?',
    answer: 'Pode sim! Usa o formulário da página de contato e a gente analisa.',
  },
];

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
            <a href="#quem-somos" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Quem somos nós</a>
            <Link to="/blog" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Blog</Link>
            <a href="#fale-conosco" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Fale conosco</a>
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
            <a href="#perguntas-frequentes" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Perguntas frequentes</a>
            <a href="#como-funciona" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Como funciona</a>
            <a href="#fale-conosco" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Contato</a>
            <Link to="/" className="text-xs text-[#8a8a8a] transition-colors hover:text-[#FF4D00]">Termos de uso</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-[#333] pt-8 lg:grid-cols-2">
        <section id="quem-somos" className="scroll-mt-24 rounded-3xl border border-[#2d2d2d] bg-[#202020] p-6">
          <h2 className="mb-4 text-lg font-black text-white">Quem somos nós</h2>
          <div className="space-y-3 text-sm leading-relaxed text-[#b8b8b8]">
            <p>
              O cuponito nasceu de uma frustração muito simples: a gente clicava num cupom, colava no carrinho e… nada. Expirado. Inválido. Já usado.
            </p>
            <p>
              Então resolvemos criar o que nós gostaríamos de encontrar: um lugar onde os cupons são testados de verdade, atualizados todo dia, e organizados de um jeito que qualquer pessoa consiga usar: sem precisar de tutorial, sem cadastro, sem enrolação.
            </p>
            <p>Somos um time pequeno com uma missão simples: se tem desconto bom no Brasil, o cuponito acha pra você.</p>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 rounded-3xl border border-[#2d2d2d] bg-[#202020] p-6">
          <h2 className="mb-4 text-lg font-black text-white">Como funciona</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#b8b8b8]">Economizar com o cuponito é simples assim:</p>
          <ol className="space-y-2 text-sm leading-relaxed text-[#b8b8b8]">
            {howItWorksSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-black text-white">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-[#b8b8b8]">
            O que faz o cuponito diferente é que a gente só publica cupom que funciona. Cada código é verificado antes de ir pro ar e a lista é atualizada todos os dias.
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-white">Sem cadastro. Sem taxa. Sem pegadinha. Só desconto de verdade.</p>
        </section>

        <section id="fale-conosco" className="scroll-mt-24 rounded-3xl border border-[#2d2d2d] bg-[#202020] p-6">
          <h2 className="mb-4 text-lg font-black text-white">Fale conosco</h2>
          <div className="space-y-3 text-sm leading-relaxed text-[#b8b8b8]">
            <p>Encontrou um cupom que não funcionou? Quer sugerir uma loja? Tem alguma dúvida que não está no FAQ?</p>
            <p>Manda mensagem aqui embaixo. O time do Cuponito lê tudo e te responde o mais rápido possível.</p>
            <p>Adoramos ouvir, de verdade.</p>
          </div>
          <a
            href="mailto:contato@cuponito.com.br?subject=Contato%20pelo%20Cuponito"
            className="mt-5 inline-flex rounded-full bg-[#FF6B35] px-5 py-2 text-sm font-black text-white transition-colors hover:bg-[#FF4D00]"
          >
            Enviar mensagem
          </a>
        </section>

        <section id="perguntas-frequentes" className="scroll-mt-24 rounded-3xl border border-[#2d2d2d] bg-[#202020] p-6">
          <h2 className="mb-4 text-lg font-black text-white">Perguntas frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-sm font-black text-white">{faq.question}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#b8b8b8]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    <div className="mx-auto mt-6 max-w-[1100px] border-t border-[#333] pt-4 text-center text-[11px] text-[#666]">
      © {new Date().getFullYear()} Cuponito · Todos os direitos reservados · Os preços e condições podem variar sem aviso prévio
    </div>
  </footer>
);

export default Footer;
