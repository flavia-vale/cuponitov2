import InstitutionalLayout from './InstitutionalLayout';

const termsSections = [
  {
    title: 'Uso gratuito dos cupons',
    content:
      'O Cuponito organiza cupons, ofertas e links promocionais para ajudar você a economizar. O uso do site é gratuito e não exige cadastro para copiar códigos de desconto.',
  },
  {
    title: 'Validade das ofertas',
    content:
      'Apesar da verificação frequente, os cupons podem mudar, expirar ou depender de regras definidas por cada loja, como valor mínimo, categoria participante, estoque ou limite por CPF.',
  },
  {
    title: 'Responsabilidade das lojas',
    content:
      'A compra, o pagamento, a entrega, a troca e o atendimento pós-venda acontecem diretamente no site da loja parceira. Antes de finalizar o pedido, confira as condições exibidas pela loja.',
  },
  {
    title: 'Links de afiliados',
    content:
      'Alguns links podem gerar comissão para o Cuponito quando uma compra é concluída, sem custo adicional para você. Essa comissão ajuda a manter a curadoria e atualização dos descontos.',
  },
  {
    title: 'Contato',
    content:
      'Se encontrar um cupom com problema, uma informação desatualizada ou quiser sugerir uma loja, fale com a gente pela página de contato.',
  },
];

export default function TermsPage() {
  return (
    <InstitutionalLayout
      title="Termos de uso"
      description="Confira as condições de uso do Cuponito, incluindo validade de cupons, responsabilidade das lojas e links de afiliados."
      canonical="https://www.cuponito.com.br/termos-de-uso"
    >
      <p>
        Estes termos explicam como usar o Cuponito de forma simples e transparente. Ao navegar pelo site, você concorda com as condições abaixo.
      </p>

      <div className="space-y-6">
        {termsSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-border bg-[#f8f9fa] p-5">
            <h2 className="text-lg font-black text-foreground">{section.title}</h2>
            <p className="mt-2">{section.content}</p>
          </section>
        ))}
      </div>
    </InstitutionalLayout>
  );
}
