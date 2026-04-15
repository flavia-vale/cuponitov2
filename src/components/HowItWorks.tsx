import { useSettings } from '@/hooks/useSettings';

const HowItWorks = () => {
  const { data: settings } = useSettings();
  
  const content = settings?.how_it_works || {
    title: "Como usar um cupom?",
    step1: "Encontre sua loja favorita",
    step2: "Copie o código com 1 clique",
    step3: "Cole no carrinho e economize!"
  };

  const steps = [
    { number: 1, text: content.step1, color: 'bg-orange-100 text-orange-600' },
    { number: 2, text: content.step2, color: 'bg-blue-100 text-blue-600' },
    { number: 3, text: content.step3, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="rounded-3xl border border-border bg-white p-8 md:p-14">
        <h2 className="mb-12 text-center text-xl font-black text-foreground md:text-3xl">
          {content.title}
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full text-xl font-black shadow-sm ${step.color}`}>
                {step.number}
              </div>
              <p className="text-base font-bold text-muted-foreground max-w-[220px] leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;