import InstitutionalLayout from './InstitutionalLayout';

export default function AboutPage() {
  return (
    <InstitutionalLayout
      title="Quem somos nós"
      description="Conheça a história do Cuponito e nossa missão de encontrar cupons testados e descontos bons no Brasil."
      canonical="https://www.cuponito.com.br/quem-somos"
      jsonLdRoute={{ type: 'about' }}
    >
      <p>
        O cuponito nasceu de uma frustração muito simples: a gente clicava num cupom, colava no carrinho e… nada. Expirado. Inválido. Já usado.
      </p>
      <p>
        Então resolvemos criar o que nós gostaríamos de encontrar: um lugar onde os cupons são testados de verdade, atualizados todo dia, e organizados de um jeito que qualquer pessoa consiga usar: sem precisar de tutorial, sem cadastro, sem enrolação.
      </p>
      <p className="font-bold text-foreground">
        Somos um time pequeno com uma missão simples: se tem desconto bom no Brasil, o cuponito acha pra você.
      </p>

      <h2 className="pt-2 text-xl font-black text-foreground md:text-2xl">Cuponito e Espelha Grupos</h2>
      <p>
        O Cuponito é feito pela mesma equipe do{' '}
        <a
          href="https://espelhagrupos.com.br"
          className="font-bold text-[#ff5200] hover:underline"
        >
          Espelha Grupos
        </a>
        , software web brasileiro para afiliadas e admins de grupos de WhatsApp. O Espelha Grupos
        espelha ofertas de grupos e canais de origem para os seus grupos, troca cada link pelo seu
        código de afiliada (Shopee, Mercado Livre, Amazon, Magalu, SHEIN, AliExpress) e publica com
        filas, intervalos e histórico de envios. Teste grátis de 7 dias; Pro R$ 69 por 30 dias.
      </p>
    </InstitutionalLayout>
  );
}
