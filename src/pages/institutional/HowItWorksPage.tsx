import InstitutionalLayout from './InstitutionalLayout';
import { howItWorksSteps } from './content';

export default function HowItWorksPage() {
  return (
    <InstitutionalLayout
      title="Como funciona"
      description="Veja como usar o Cuponito para buscar lojas, copiar cupons verificados e economizar no carrinho."
      canonical="https://www.cuponito.com.br/como-funciona"
    >
      <p className="font-bold text-foreground">Economizar com o cuponito é simples assim:</p>
      <ol className="space-y-3">
        {howItWorksSteps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-sm font-black text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p>
        O que faz o cuponito diferente é que a gente só publica cupom que funciona. Cada código é verificado antes de ir pro ar e a lista é atualizada todos os dias.
      </p>
      <p className="font-bold text-foreground">Sem cadastro. Sem taxa. Sem pegadinha. Só desconto de verdade.</p>
    </InstitutionalLayout>
  );
}
