import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import SEOHead from '@/components/SEOHead';
import StoreCouponCard from '@/components/StoreCouponCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronDown,
  Mail,
  ArrowRight
} from 'lucide-react';
import { getMonthYear, cn } from '@/lib/utils';
import StoreIcon from '@/components/StoreIcon';

type FilterType = 'all' | 'code' | 'offer' | 'free';

export default function StorePage() {
  const { slug } = useParams({ strict: false });
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands, isLoading: storesLoading } = useStoreBrands();
  const { data: settings } = useSettings();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showExpired, setShowExpired] = useState(false);
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    return storeBrands.find((b) => b.slug === slug);
  }, [storeBrands, slug]);

  const storeName = storeBrand?.name || '';
  const brandColor = storeBrand?.brand_color || '#FF4D00';

  const storeCoupons = useMemo(() => {
    if (!coupons || !storeName) return [];
    return coupons.filter(c => c.store === storeName);
  }, [coupons, storeName]);

  const activeCoupons = useMemo(() => {
    return storeCoupons.filter(c => c.status);
  }, [storeCoupons]);

  const expiredCoupons = useMemo(() => {
    return storeCoupons.filter(c => !c.status);
  }, [storeCoupons]);

  const filteredCoupons = useMemo(() => {
    return activeCoupons.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'code') return !!c.code;
      if (filter === 'offer') return !c.code && c.category !== 'Frete Grátis';
      if (filter === 'free') return c.category === 'Frete Grátis';
      return true;
    });
  }, [activeCoupons, filter]);

  const popularStores = useMemo(() => {
    if (!storeBrands) return [];
    return storeBrands
      .filter(s => s.slug !== slug && s.is_featured)
      .slice(0, 5);
  }, [storeBrands, slug]);

  const relatedStores = useMemo(() => {
    if (!storeBrands || !storeBrand) return [];
    // Since we don't have categories in stores table, we'll just show other featured stores
    return storeBrands
      .filter(s => s.slug !== slug && !s.is_featured)
      .slice(0, 4);
  }, [storeBrands, storeBrand, slug]);

  const handleVisit = () => {
    const link = storeCoupons[0]?.link || '/';
    window.open(link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  if (storeBrands && !storeBrand && !storesLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef] p-4 text-center">
        <Header />
        <div className="max-w-md space-y-4 py-20">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Loja não encontrada</h2>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">Voltar ao início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = couponsLoading || storesLoading;

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans antialiased text-[#1a1a1a] text-sm">
      {storeName && (
        <SEOHead
          title={`Cupom de Desconto ${storeName} | Até 80% OFF – ${monthYear} | Cuponito`}
          description={storeBrand?.meta_description || `Cupom de desconto ${storeName} válido hoje: até 80% OFF. Códigos verificados e atualizados diariamente pelo Cuponito.`}
          canonical={`https://www.cuponito.com.br/desconto/${slug}`}
          ogImage={storeBrand?.logo_url || undefined}
          jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filteredCoupons }}
        />
      )}
      
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-[#e8e5e0] py-2.5 px-5">
        <div className="max-w-[1100px] mx-auto flex items-center gap-1.5 text-xs text-[#aaa]">
          <Link to="/" className="text-[#FF4D00] hover:underline">Início</Link>
          <span>›</span>
          <Link to="/lojas" className="text-[#FF4D00] hover:underline">Lojas</Link>
          <span>›</span>
          <span className="truncate">Cupom {storeName}</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[22px] py-[22px] pb-10">
          
          {/* COLUNA PRINCIPAL */}
          <main className="space-y-4">
            
            {/* HERO DA LOJA */}
            <section className="bg-white border border-[#e8e5e0] rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5">
              <div className="shrink-0">
                <StoreIcon
                  name={storeName}
                  brandColor={brandColor}
                  logoUrl={storeBrand?.logo_url}
                  size="xl"
                  className="border border-[#e8e5e0]"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-[22px] font-bold text-[#1a1a1a]">Cupom de Desconto {storeName}</h1>
                  <span className="bg-[#EAF3DE] text-[#2E7D32] text-[10px] font-bold px-[9px] py-0.5 rounded-[9px]">Verificado hoje</span>
                </div>
                <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#888] mb-2.5">
                  <span className="flex items-center gap-1">
                    <span className="text-[#FFB347]">★★★★★</span> <strong>4,8</strong> (2.341 avaliações)
                  </span>
                  <span className="text-[#2E7D32] font-semibold flex items-center gap-1">✓ Loja confiável</span>
                  <span>Atualizado em {monthYear}</span>
                </div>
                <p className="text-[13px] text-[#555] leading-relaxed max-w-[580px]">
                  {storeBrand?.description || `A ${storeName} é uma das maiores lojas do Brasil. Aqui você encontra os melhores cupons ${storeName} verificados, atualizados várias vezes ao dia pela equipe do Cuponito.`}
                </p>
                <div className="flex gap-4 mt-3.5">
                  <div className="bg-[#f5f3ef] rounded-xl p-[9px_14px] text-center min-w-[80px]">
                    <span className="block text-lg font-bold text-[#FF4D00]">{activeCoupons.length}</span>
                    <span className="text-[10px] text-[#888]">cupons ativos</span>
                  </div>
                  <div className="bg-[#f5f3ef] rounded-xl p-[9px_14px] text-center min-w-[80px]">
                    <span className="block text-lg font-bold text-[#FF4D00]">até 80%</span>
                    <span className="text-[10px] text-[#888]">de desconto</span>
                  </div>
                  <div className="bg-[#f5f3ef] rounded-xl p-[9px_14px] text-center min-w-[80px] hidden sm:block">
                    <span className="block text-lg font-bold text-[#FF4D00]">4.871</span>
                    <span className="text-[10px] text-[#888]">usos este mês</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleVisit}
                className="bg-[#FF4D00] text-white border-none rounded-xl p-[10px_20px] text-[13px] font-bold cursor-pointer whitespace-nowrap mt-1 hover:bg-[#D83C00] transition-colors w-full md:w-auto"
              >
                Visitar {storeName} ↗
              </button>
            </section>

            {/* FILTROS */}
            <div className="bg-white border border-[#e8e5e0] rounded-xl p-[12px_14px] flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#888] mr-1">Filtrar:</span>
              <button 
                onClick={() => setFilter('all')}
                className={cn(
                  "border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all",
                  filter === 'all' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]"
                )}
              >
                Todos ({activeCoupons.length})
              </button>
              <button 
                onClick={() => setFilter('code')}
                className={cn(
                  "border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all",
                  filter === 'code' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]"
                )}
              >
                Códigos ({activeCoupons.filter(c => c.code).length})
              </button>
              <button 
                onClick={() => setFilter('offer')}
                className={cn(
                  "border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all",
                  filter === 'offer' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]"
                )}
              >
                Ofertas ({activeCoupons.filter(c => !c.code && c.category !== 'Frete Grátis').length})
              </button>
              <button 
                onClick={() => setFilter('free')}
                className={cn(
                  "border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all",
                  filter === 'free' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]"
                )}
              >
                Frete grátis ({activeCoupons.filter(c => c.category === 'Frete Grátis').length})
              </button>
            </div>

            {/* SEÇÃO DE CUPONS */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[15px] font-bold text-[#1a1a1a]">
                Cupons ativos {storeName} <span className="text-xs text-[#888] font-normal ml-1">{filteredCoupons.length} encontrados</span>
              </div>
              <span className="text-xs text-[#FF4D00] cursor-pointer flex items-center gap-1">
                Ordenar: Mais populares <ChevronDown size={14} />
              </span>
            </div>

            <div className="space-y-2.5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
              ) : (
                filteredCoupons.map(coupon => (
                  <StoreCouponCard key={coupon.id} coupon={coupon} />
                ))
              )}
            </div>

            {/* CUPONS EXPIRADOS */}
            {expiredCoupons.length > 0 && (
              <div className="mt-6">
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-3 group"
                  onClick={() => setShowExpired(!showExpired)}
                >
                  <ChevronRight size={16} className={cn("transition-transform text-[#888]", showExpired && "rotate-90")} />
                  <span className="text-[13px] text-[#888]">
                    Mostrar <strong>{expiredCoupons.length} cupons expirados</strong> — podem ainda funcionar
                  </span>
                </div>

                {showExpired && (
                  <div className="space-y-2.5">
                    {expiredCoupons.map(coupon => (
                      <StoreCouponCard key={coupon.id} coupon={coupon} isExpired />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SOBRE A LOJA */}
            <section className="bg-white border border-[#e8e5e0] rounded-2xl p-5 mt-4">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-3 pb-2.5 border-b-2 border-[#FF4D00] inline-block">Sobre a {storeName}</h2>
              <div className="space-y-3 text-[13px] text-[#555] leading-relaxed">
                <p>{storeBrand?.description || `A ${storeName} é uma das lojas mais reconhecidas do mercado brasileiro, oferecendo uma ampla variedade de produtos com qualidade e confiança.`}</p>
                <p>Com anos de atuação, a loja se destaca pelo excelente atendimento ao cliente e logística eficiente, garantindo que suas compras cheguem com rapidez e segurança.</p>
                <div className="flex flex-wrap gap-2.5 mt-3.5">
                  <span className="bg-[#f5f3ef] rounded-lg p-[6px_12px] text-xs text-[#555]">Loja Verificada</span>
                  <span className="bg-[#f5f3ef] rounded-lg p-[6px_12px] text-xs text-[#555]">Pagamento Seguro</span>
                </div>
              </div>
            </section>

            {/* COMO USAR */}
            <section className="bg-white border border-[#e8e5e0] rounded-2xl p-5 mt-4">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-4 pb-2.5 border-b-2 border-[#FF4D00] inline-block">Como usar o cupom {storeName}</h2>
              <div className="flex flex-col gap-3.5">
                {[
                  { title: 'Escolha seu cupom', desc: 'Navegue pelos cupons acima e clique em "Copiar" no código que quiser usar.' },
                  { title: `Vá para a ${storeName}`, desc: `Clique em "Copiar e ir à loja" — você será redirecionado direto para a ${storeName} com o código já copiado.` },
                  { title: 'Adicione ao carrinho', desc: 'Escolha o produto desejado e adicione ao carrinho de compras normalmente.' },
                  { title: 'Cole o código e economize', desc: 'No carrinho, procure o campo de cupom de desconto, cole o código copiado e clique em Aplicar.' }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FF4D00] text-white text-[13px] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-[#1a1a1a] mb-0.5">{step.title}</div>
                      <div className="text-xs text-[#888] leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white border border-[#e8e5e0] rounded-2xl p-5 mt-4">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-4 pb-2.5 border-b-2 border-[#FF4D00] inline-block">Perguntas frequentes — {storeName}</h2>
              <div className="divide-y divide-[#f0ede8]">
                {[
                  { q: `O cupom ${storeName} é gratuito?`, a: 'Sim, todos os cupons listados aqui são completamente gratuitos. O Cuponito nunca cobra para exibir ou liberar um cupom.' },
                  { q: `Os cupons ${storeName} funcionam no app?`, a: 'A maioria dos cupons funciona tanto no site quanto no app. Alguns podem ser exclusivos do app.' },
                  { q: 'Com que frequência os cupons são atualizados?', a: `Nossa equipe verifica e atualiza os cupons da ${storeName} várias vezes ao dia.` }
                ].map((item, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-[13px] font-bold text-[#1a1a1a] mb-1.5 flex items-center justify-between cursor-pointer">
                      {item.q} <ChevronDown size={14} className="text-[#aaa]" />
                    </div>
                    <div className="text-xs text-[#555] leading-relaxed">{item.a}</div>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* SIDEBAR */}
          <aside className="space-y-3.5">
            <div className="sticky top-[72px] space-y-3.5">
              
              {/* CTA PRINCIPAL */}
              <div className="bg-[#FF4D00] rounded-2xl p-[18px] text-center text-white">
                <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-[13px] font-bold mx-auto mb-3">
                  {storeName.slice(0, 3).toUpperCase()}
                </div>
                <h3 className="text-[15px] font-bold mb-1.5">Ir direto para a {storeName}</h3>
                <p className="text-xs text-white/80 mb-3.5 leading-relaxed">Acesse a loja agora e use um dos nossos cupons para economizar.</p>
                <button 
                  onClick={handleVisit}
                  className="bg-white text-[#FF4D00] border-none rounded-lg p-[11px] text-[13px] font-bold cursor-pointer w-full hover:bg-white/90 transition-colors"
                >
                  Visitar {storeName} ↗
                </button>
                <div className="text-[10px] text-white/60 mt-2">Você será redirecionado para o site oficial</div>
              </div>

              {/* ALERTA DE NOVOS CUPONS */}
              <div className="bg-white border border-[#e8e5e0] rounded-2xl p-4">
                <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-2">Avise-me de novos cupons</h4>
                <p className="text-xs text-[#888] mb-3 leading-relaxed">Receba um e-mail quando novos cupons da {storeName} forem publicados.</p>
                <div className="flex gap-1.5">
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="flex-1 border border-[#ddd] rounded-lg p-[8px_10px] text-xs outline-none focus:border-[#FF4D00] min-w-0"
                  />
                  <button className="bg-[#FF4D00] text-white border-none rounded-lg p-[8px_12px] text-[11px] font-bold cursor-pointer whitespace-nowrap hover:bg-[#D83C00] transition-colors">
                    Alertar
                  </button>
                </div>
              </div>

              {/* OUTRAS LOJAS POPULARES */}
              <div className="bg-white border border-[#e8e5e0] rounded-2xl p-4">
                <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-3">Lojas populares agora</h4>
                <div className="divide-y divide-[#f0ede8]">
                  {popularStores.map(s => (
                    <Link
                      key={s.id}
                      to="/desconto/$slug"
                      params={{ slug: s.slug }}
                      className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0 group"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#e8e5e0] shrink-0">
                        <StoreIcon name={s.name} brandColor={s.brand_color} logoUrl={s.logo_url} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#1a1a1a] truncate group-hover:text-[#FF4D00] transition-colors">{s.name}</div>
                        <div className="text-[11px] text-[#888]">Cupons ativos</div>
                      </div>
                      <ChevronRight size={14} className="text-[#FF4D00]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* LOJAS RELACIONADAS */}
              <div className="bg-white border border-[#e8e5e0] rounded-2xl p-4">
                <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-3">Lojas recomendadas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {relatedStores.map(s => (
                    <Link
                      key={s.id}
                      to="/desconto/$slug"
                      params={{ slug: s.slug }}
                      className="border border-[#e8e5e0] rounded-lg p-2.5 flex flex-col items-center gap-1.5 hover:border-[#FF4D00] transition-colors group"
                    >
                      <div className="w-[30px] h-[30px] rounded-md overflow-hidden shrink-0">
                        <StoreIcon name={s.name} brandColor={s.brand_color} logoUrl={s.logo_url} size="sm" />
                      </div>
                      <div className="text-[10px] text-[#555] text-center truncate w-full group-hover:text-[#FF4D00]">{s.name}</div>
                      <div className="text-[10px] text-[#FF4D00] font-bold">Ver cupons</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* AVISO AFILIADOS */}
              <div className="bg-[#f9f7f4] border border-[#e8e5e0] rounded-xl p-[11px_14px] text-[11px] text-[#999] leading-relaxed text-center">
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