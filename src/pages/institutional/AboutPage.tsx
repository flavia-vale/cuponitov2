import InstitutionalLayout from './InstitutionalLayout';

export default function AboutPage() {
  return (
    <InstitutionalLayout
      title="Quem somos nós"
      description="Conheça a história do Cuponito e nossa missão de encontrar cupons testados e descontos bons no Brasil."
      canonical="https://www.cuponito.com.br/quem-somos"
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
    </InstitutionalLayout>
  );
}
