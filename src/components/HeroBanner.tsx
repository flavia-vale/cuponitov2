import { useSettings } from '@/hooks/useSettings';

export default function HeroBanner() {
  const { data: settings } = useSettings();
  
  const content = settings?.hero_content || {
    hero_title: "Economize de verdade em cada compra.",
    hero_subtitle: "Cupons verificados e selecionados a dedo.",
    description: "O cuponito é o seu amigo que entende de descontos. Aqui você encontra cupons reais das maiores lojas do Brasil."
  };

  return (
    <section className="relative overflow-hidden bg-background pb-12 pt-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted-orange px-3 py-1 text-xs font-bold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            NOVOS CUPONS HOJE
          </div>
          
          <h1 className="mb-4 text-4xl font-black leading-tight text-foreground sm:text-5xl">
            {content.hero_title}
          </h1>
          
          <p className="mb-8 text-lg font-medium text-text-gray">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#destaques" className="btn-primary shadow-lg shadow-primary/20">
              Ver descontos do dia
            </a>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted-orange flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Usuário" className="h-full w-full object-cover" />
                </div>
              ))}
              <div className="flex h-10 items-center pl-4 text-xs font-bold text-text-gray/60 uppercase tracking-wider">
                +2.4k pessoas economizando
              </div>
            </div>
          </div>
        </div>
        
        {/* Elemento decorativo */}
        <div className="absolute -right-20 -top-20 hidden h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl lg:block" />
        <div className="absolute -bottom-20 -left-20 hidden h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl lg:block" />
      </div>
    </section>
  );
}
