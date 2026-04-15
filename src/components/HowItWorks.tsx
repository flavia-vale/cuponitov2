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
    { number: 1, text: content.step1, color: 'bg-orange-50 text-orange-600' },
    { number: 2, text: content.step2, color: 'bg-blue-50 text-blue-600' },
    { number: 3, text: content.step3, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="rounded-[2.5rem] border border-border bg-white px-6 py-12 md:px-16 md:py-20 shadow-sm">
        <h2 className="mb-14 text-center text-2xl font-black text-foreground md:text-4xl">
          {content.title}
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black shadow-inner ${step.color}`}>
                {step.number}
              </div>
              <p className="text-base font-bold text-muted-foreground max-w-[200px] leading-snug md:text-lg">
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