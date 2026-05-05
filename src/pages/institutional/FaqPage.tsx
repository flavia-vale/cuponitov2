import InstitutionalLayout from './InstitutionalLayout';
import { faqs } from './content';

export default function FaqPage() {
  return (
    <InstitutionalLayout
      title="Perguntas frequentes"
      description="Tire dúvidas sobre cupons, cadastro, custo, atualização dos descontos e sugestões de lojas no Cuponito."
      canonical="https://www.cuponito.com.br/perguntas-frequentes"
    >
      <div className="space-y-6">
        {faqs.map((faq) => (
          <section key={faq.question} className="rounded-2xl border border-border bg-[#f8f9fa] p-5">
            <h2 className="text-lg font-black text-foreground">{faq.question}</h2>
            <p className="mt-2">{faq.answer}</p>
          </section>
        ))}
      </div>
    </InstitutionalLayout>
  );
}
