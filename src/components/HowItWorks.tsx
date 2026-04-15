const HowItWorks = () => {
  const steps = [
    { number: 1, text: 'Encontre sua loja favorita' },
    { number: 2, text: 'Copie o código com 1 clique' },
    { number: 3, text: 'Cole no carrinho e economize!' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl border border-border bg-white p-8 md:p-12">
        <h2 className="mb-10 text-center text-xl font-black text-foreground md:text-2xl">
          Como usar um cupom?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-[#ff5200]">
                {step.number}
              </div>
              <p className="text-sm font-bold text-muted-foreground max-w-[180px]">
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