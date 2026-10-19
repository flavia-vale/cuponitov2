import { lazy, Suspense } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import GroupJoinCTA from '@/components/GroupJoinCTA';
import GroupOfferList from '@/components/GroupOfferList';
import { Skeleton } from '@/components/ui/skeleton';
import { useGroupOffers } from '@/hooks/useGroupOffers';
import { useWhatsappGroupInfo } from '@/hooks/useWhatsappGroupPages';
import { ACHADINHOS_PATH, offerTime, todayLabel } from '@/lib/groupOfferFeed';
import { groupFactsSentence, GROUP_BASE_PATH } from '@/lib/whatsappGroup';
import { SITE_URL } from '@/lib/seo';

const Footer = lazy(() => import('@/components/Footer'));

/** /achadinhos-hoje: as ofertas reais que saíram hoje no grupo (mesmo conteúdo do HTML do servidor). */
export default function AchadinhosHojePage() {
  const { data: offers, isLoading } = useGroupOffers();
  const info = useWhatsappGroupInfo();
  const list = offers ?? [];
  const newest = list.find(offer => offer.sentAt)?.sentAt ?? null;
  const h1 = `Achadinhos de hoje, ${todayLabel()}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] font-sans">
      <SEOHead
        title="Achadinhos de hoje: ofertas do dia | Cuponito"
        description={`Os achadinhos e ofertas que saíram hoje no grupo de WhatsApp do Cuponito: ${info.stores}. Atualizado ao longo do dia.`}
        canonical={`${SITE_URL}${ACHADINHOS_PATH}`}
        ogUpdatedTime={newest ?? undefined}
        robots={!isLoading && list.length === 0 ? 'noindex, follow' : undefined}
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link to={GROUP_BASE_PATH} className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
          <ArrowLeft size={14} /> Grupo no WhatsApp
        </Link>

        <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#ff5200]">Saiu no grupo</p>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">{h1}</h1>
          <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {newest && <>Última oferta às {offerTime(newest)}. </>}
            Estas são as ofertas que saíram hoje no {info.group_name}, o grupo de WhatsApp do Cuponito: {groupFactsSentence(info)}
          </p>

          <GroupJoinCTA title="Receba os achadinhos no WhatsApp" source="achadinhos_top" className="mb-10" />

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : list.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-black text-foreground md:text-2xl">Ofertas que saíram no grupo</h2>
              <GroupOfferList offers={list} />
            </section>
          ) : (
            <p className="text-muted-foreground">
              As ofertas de hoje aparecem aqui assim que saem no grupo. Enquanto isso, veja os{' '}
              <a href="/cupons" className="font-bold text-[#ff5200] hover:underline">cupons de hoje</a>.
            </p>
          )}

          <section className="mt-10 space-y-3 text-muted-foreground">
            <h2 className="text-xl font-black text-foreground md:text-2xl">Como aproveitar</h2>
            <p>
              Toque em "Ver oferta" para abrir o produto no site ou no aplicativo oficial da loja. Preço e estoque mudam rápido:
              confira o valor final no carrinho. Os links são de afiliado; o Cuponito pode receber uma comissão, sem custo extra para você.
            </p>
            <p>
              Quer receber na hora, sem precisar abrir o site? Entre no{' '}
              <a href={GROUP_BASE_PATH} className="font-bold text-[#ff5200] hover:underline">grupo de ofertas no WhatsApp</a> ou veja as
              páginas de <a href={`${GROUP_BASE_PATH}/achadinhos`} className="font-bold text-[#ff5200] hover:underline">achadinhos</a>,{' '}
              <a href={`${GROUP_BASE_PATH}/shopee`} className="font-bold text-[#ff5200] hover:underline">Shopee</a> e{' '}
              <a href={`${GROUP_BASE_PATH}/mercado-livre`} className="font-bold text-[#ff5200] hover:underline">Mercado Livre</a>.
            </p>
          </section>

          <GroupJoinCTA title="Receba os achadinhos no WhatsApp" source="achadinhos_footer" className="mt-10" />
        </article>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
