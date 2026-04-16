import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import SEOHead from '@/components/SEOHead';

import StoreCouponCard from '@/components/StoreCouponCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,

  ChevronRight, 
  Star, 
  ShieldCheck, 
  Zap, 
  Search, 
  Mail, 
  ArrowUpRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { getMonthYear, cn } from '@/lib/utils';

type FilterType = 'all' | 'code' | 'offer' | 'free';

export default function StorePage() {
  const { slug } = useParams({ strict: false });
  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: settings } = useSettings();
  const [filter, setFilter] = useState<FilterType>('all');

  const [showExpired, setShowExpired] = useState(false);
  const [email, setEmail] = useState('');
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    
    let found = storeBrands.find((b) => b.slug === slug);
    if (found) return found;

    const cleanSlug = slug
      .replace(/^cupom-desconto-/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    return storeBrands.find((b) => {
      const dbSlugClean = b.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dbNameClean = b.display_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return dbSlugClean === cleanSlug || dbNameClean === cleanSlug;
    });
  }, [storeBrands, slug]);

  const storeName = storeBrand?.display_name || '';
  const storeLogo = storeBrand?.logo_url;
  const brandColor = storeBrand?.brand_color || '#FF4D00';

  const storeCoupons = useMemo(() => {
    if (!coupons || !storeName) return [];
    return coupons.filter(c => c.store === storeName);
  }, [coupons, storeName]);

  const filteredCoupons = useMemo(() => {
    return storeCoupons.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'code') return !!c.code;
      if (filter === 'offer') return !c.code && c.category !== 'Frete Grátis';
      if (filter === 'free') return c.category === 'Frete Grátis';
      return true;
    });
  }, [storeCoupons, filter]);

  const expiredCouponsCount = 9; // Placeholder count for demo

  const handleVisit = () => {
    const link = storeCoupons[0]?.link || '/';
    window.open(link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const handleAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: 'Tudo pronto!', description: `Você receberá novos cupons de ${storeName} em seu e-mail.` });
      setEmail('');
    }
  };

  if (storeBrands && !storeBrand && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef] p-4 text-center">
        <Header />
        <div className="max-w-md space-y-4 py-20">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Loja não encontrada</h2>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft size={18} /> Voltar ao início
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans antialiased text-[#1a1a1a]">
      {storeName && (
        <SEOHead
          title={`Cupom de Desconto ${storeName} | Até 80% OFF – ${monthYear} | cuponito.`}
          description={`Cupom de desconto ${storeName} válido hoje: códigos verificados e atualizados diariamente pelo cuponito. Economize agora!`}
          canonical={`https://cuponito.com.br/desconto/${slug}`}
          jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filteredCoupons }}
        />

      )}

      <Header />

      {/* BREADCRUMB */}
      <div className="border-b border-black/5 bg-white px-4 py-3 text-[11px] md:text-xs">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 text-[#aaa]">
          <Link to="/" className="text-primary hover:underline">Início</Link>
          <ChevronRight size={10} />
          <Link to="/" className="text-primary hover:underline">Lojas</Link>
          <ChevronRight size={10} />
          <span className="truncate">Cupom {storeName}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* COLUNA PRINCIPAL */}
          <main className="space-y-4">
            
            {/* STORE HERO */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
                {storeLogo ? (
                  <img src={storeLogo} alt={storeName} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-2xl font-black text-primary uppercase">{storeName.slice(0,3)}</span>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-black leading-tight">Cupom de Desconto {storeName}</h1>
                  <span className="badge-discount bg-[#EAF3DE] text-[#2E7D32]">Verificado hoje</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#888]">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 text-accent">
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                    </div>
                    <span className="font-bold text-[#1a1a1a]">4,8</span>
                    <span>(2.341 avaliações)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                    <ShieldCheck size={14} /> Loja confiável
                  </div>
                  <div>Atualizado em {monthYear}</div>
                </div>

                <p className="text-sm text-[#555] leading-relaxed max-w-2xl">
                  {storeName} é referência em seu segmento, oferecendo uma vasta gama de produtos com qualidade e confiança. Aqui você encontra os melhores cupons {storeName} verificados, atualizados pela equipe do cuponito.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="bg-[#f5f3ef] rounded-xl px-4 py-2 text-center">
                    <span className="block text-lg font-bold text-primary">{storeCoupons.length}</span>
                    <span className="text-[10px] text-[#888] uppercase font-bold tracking-tight">cupons ativos</span>
                  </div>
                  <div className="bg-[#f5f3ef] rounded-xl px-4 py-2 text-center">
                    <span className="block text-lg font-bold text-primary">até 80%</span>
                    <span className="text-[10px] text-[#888] uppercase font-bold tracking-tight">de desconto</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleVisit}
                className="btn-primary w-full md:w-auto px-8"
              >
                Visitar {storeName} <ArrowUpRight size={16} />
              </button>
            </section>

            {/* FILTROS */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white p-3 shadow-sm overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold text-[#888] px-2">Filtrar:</span>
              <button 
                onClick={() => setFilter('all')}
                className={cn("filter-btn px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap", filter === 'all' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-[#f5f3ef] text-[#555] hover:bg-black/5")}
              >
                Todos ({storeCoupons.length})
              </button>
              <button 
                onClick={() => setFilter('code')}
                className={cn("filter-btn px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap", filter === 'code' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-[#f5f3ef] text-[#555] hover:bg-black/5")}
              >
                Códigos ({storeCoupons.filter(c => c.code).length})
              </button>
              <button 
                onClick={() => setFilter('offer')}
                className={cn("filter-btn px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap", filter === 'offer' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-[#f5f3ef] text-[#555] hover:bg-black/5")}
              >
                Ofertas ({storeCoupons.filter(c => !c.code && c.category !== 'Frete Grátis').length})
              </button>
              <button 
                onClick={() => setFilter('free')}
                className={cn("filter-btn px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap", filter === 'free' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-[#f5f3ef] text-[#555] hover:bg-black/5")}
              >
                Frete Grátis ({storeCoupons.filter(c => c.category === 'Frete Grátis').length})
              </button>
            </div>

            {/* LISTA DE CUPONS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base font-bold">Cupons ativos {storeName} <span className="text-xs text-[#888] font-normal ml-1">({filteredCoupons.length} encontrados)</span></h2>
                <button className="text-xs font-bold text-primary flex items-center gap-1">Ordenar <ChevronDown size={14} /></button>
              </div>

              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
              ) : filteredCoupons.length === 0 ? (
                <div className="bg-white rounded-2xl border border-black/5 p-12 text-center space-y-3">
                  <div className="text-4xl">🔎</div>
                  <h3 className="font-bold">Nenhum cupom ativo neste filtro</h3>
                  <p className="text-sm text-[#888]">Tente limpar os filtros ou buscar por outra loja.</p>
                  <Button variant="outline" onClick={() => setFilter('all')}>Ver todos cupons</Button>
                </div>
              ) : (
                filteredCoupons.map(coupon => (
                  <StoreCouponCard key={coupon.id} coupon={coupon} />
                ))
              )}
            </div>

            {/* CUPONS EXPIRADOS */}
            <div className="mt-8">
              <button 
                onClick={() => setShowExpired(!showExpired)}
                className="flex items-center gap-2 text-sm text-[#888] font-medium hover:text-[#555] transition-colors"
              >
                <ChevronRight size={14} className={cn("transition-transform", showExpired && "rotate-90")} />
                Mostrar <strong className="text-[#555]">{expiredCouponsCount} cupons expirados</strong> — podem ainda funcionar
              </button>
              
              {showExpired && (
                <div className="mt-4 space-y-3">
                  {/* Exemplos de cupons expirados */}
                  {storeCoupons.slice(0, 1).map(c => (
                    <StoreCouponCard key={`expired-${c.id}`} coupon={{ ...c, title: `${c.title} (Expirado)` }} isExpired />
                  ))}
                </div>
              )}
            </div>

            {/* SOBRE A LOJA */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold border-b-2 border-primary inline-block pb-2 mb-2">Sobre {storeName}</h2>
              <div className="text-[13px] text-[#555] leading-[1.8] space-y-4">
                <p>O cuponito é seu parceiro ideal para economizar na {storeName}. Nossa equipe trabalha diariamente para garantir que você tenha acesso aos códigos de desconto mais recentes e promoções exclusivas.</p>
                <p>{storeName} é uma das marcas mais respeitadas em seu setor, conhecida pela excelência em atendimento e variedade de produtos. Ao utilizar um cupom do cuponito, você garante o melhor preço em sua compra.</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-[#f5f3ef] rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#888]">Loja Verificada</span>
                <span className="bg-[#f5f3ef] rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#888]">Parceiro cuponito</span>
              </div>
            </section>

            {/* COMO USAR */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold border-b-2 border-primary inline-block pb-2 mb-2">Como usar o cupom {storeName}</h2>
              <div className="grid gap-6">
                {[
                  { n: 1, t: "Escolha seu cupom", d: "Encontre o cupom que melhor se adapta à sua compra e clique em 'Copiar'." },
                  { n: 2, t: "Vá para a loja", d: "Clique no botão de redirecionamento para abrir o site oficial da loja." },
                  { n: 3, t: "Adicione ao carrinho", d: "Escolha seus produtos e adicione-os ao carrinho normalmente." },
                  { n: 4, t: "Aplique e economize", d: "No checkout, cole o código no campo de cupons e veja o valor diminuir!" },
                ].map(step => (
                  <div key={step.n} className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-black shadow-lg shadow-primary/20">{step.n}</div>
                    <div>
                      <h4 className="text-sm font-bold">{step.t}</h4>
                      <p className="text-xs text-[#888] leading-relaxed mt-0.5">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold border-b-2 border-primary inline-block pb-2 mb-2">Perguntas frequentes — {storeName}</h2>
              <div className="divide-y divide-black/5">
                {[
                  { q: `O cupom ${storeName} é gratuito?`, a: "Sim, todos os cupons no cuponito são 100% gratuitos para o consumidor brasileiro." },
                  { q: "Com que frequência os cupons são atualizados?", a: "Nossa equipe verifica e atualiza as ofertas diariamente para garantir que funcionem." },
                  { q: "Posso usar mais de um cupom por compra?", a: "Geralmente a loja permite apenas um código promocional por pedido no carrinho." },
                ].map((item, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <h4 className="text-sm font-bold flex items-center justify-between cursor-pointer group">
                      {item.q} <ChevronRight size={14} className="text-[#888] group-hover:text-primary transition-colors" />
                    </h4>
                    <p className="text-xs text-[#555] mt-2 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            <div className="sticky top-[72px] space-y-4">
              
              {/* CTA SIDEBAR */}
              <div className="rounded-2xl bg-primary p-6 text-white text-center shadow-xl shadow-primary/20">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 p-2 backdrop-blur-sm shadow-inner">
                  {storeLogo ? (
                    <img src={storeLogo} alt="" className="h-full w-full object-contain brightness-0 invert" />
                  ) : (
                    <span className="text-xl font-black uppercase">{storeName.slice(0,3)}</span>
                  )}
                </div>
                <h3 className="text-base font-bold mb-1">Ir para {storeName}</h3>
                <p className="text-xs text-white/80 mb-6 leading-relaxed">Acesse a loja oficial agora e aproveite os melhores preços.</p>
                <button 
                  onClick={handleVisit}
                  className="w-full bg-white text-primary font-black py-3 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                  Visitar Loja ↗
                </button>
                <p className="text-[10px] text-white/60 mt-4">Redirecionando para o site oficial</p>
              </div>

              {/* WHATSAPP CTA SIDEBAR */}
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <div className="bg-[#25D366] p-1 rounded-md">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  Cupons no WhatsApp
                </h4>
                <p className="text-xs text-[#888] mb-4 leading-relaxed">
                  Participe do nosso grupo e receba as melhores ofertas de {storeName} em primeira mão.
                </p>
                <a
                  href={settings?.global_links.whatsapp_group || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black py-3 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-[#25D366]/20"
                >
                  Entrar no Grupo ↗
                </a>
              </div>

              {/* POPULAR STORES */}
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-bold mb-4">Lojas populares hoje</h4>
                <div className="space-y-4">
                  {storeBrands?.slice(0, 5).map(s => (
                    <Link 
                      key={s.id} 
                      to="/desconto/$slug" 
                      params={{ slug: s.slug }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-lg bg-[#f5f3ef] border border-black/5 p-1.5 overflow-hidden">
                        {s.logo_url ? (
                          <img src={s.logo_url} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-black uppercase">{s.display_name.slice(0,2)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold group-hover:text-primary transition-colors">{s.display_name}</p>
                        <p className="text-[10px] text-[#888]">Economize agora</p>
                      </div>
                      <ChevronRight size={14} className="text-[#ccc] group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* AFFILIATE NOTE */}
              <div className="rounded-2xl bg-[#f9f7f4] border border-[#e8e5e0] p-4 text-[10px] text-[#999] leading-relaxed text-center italic">
                <Info size={12} className="inline mr-1 opacity-50" />
                Utilizamos links de afiliados. Ao comprar pelos nossos links, podemos receber comissão — sem custo extra para você.
              </div>

            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
