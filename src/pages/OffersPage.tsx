import { lazy, Suspense, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import GroupJoinCTA from '@/components/GroupJoinCTA';
import GroupOfferList from '@/components/GroupOfferList';
import AuthorBox from '@/components/blog/AuthorBox';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogAuthors } from '@/hooks/useBlog';
import { useGroupOffers } from '@/hooks/useGroupOffers';
import { useWhatsappGroupInfo, useWhatsappGroupPages } from '@/hooks/useWhatsappGroupPages';
import { authorProfileUrl, isFlavia } from '@/lib/authors';
import { filterOffersByTerms, parseOfferTerms, recentOffers } from '@/lib/groupOfferFeed';
import { SITE_URL } from '@/lib/seo';
import {
  firstContentImage,
  groupCtaTitle,
  groupFactsSentence,
  groupInfoForPage,
  isOffersPage,
  pagePath,
  parseGroupFaq,
} from '@/lib/whatsappGroup';

const Footer = lazy(() => import('@/components/Footer'));

function formatUpdatedAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
}

/**
 * /ofertas/<slug>: ofertas do dia de um nicho (as do grupo dele, filtradas pelos
 * termos da página), com o botão do grupo. Mesmo conteúdo do HTML do servidor
 * (`renderOffersPage`).
 */
export default function OffersPage({ slug }: { slug: string }) {
  const { data: pages, isLoading } = useWhatsappGroupPages();
  const globalInfo = useWhatsappGroupInfo();
  const { data: authors } = useBlogAuthors();
  const author = useMemo(() => authors?.find(item => isFlavia(item.name)) ?? null, [authors]);

  const page = useMemo(() => pages?.find(item => item.slug === slug && isOffersPage(item)), [pages, slug]);
  const siblings = useMemo(() => (pages ?? []).filter(item => item.slug !== slug), [pages, slug]);
  const info = groupInfoForPage(globalInfo, page);
  const faq = useMemo(() => parseGroupFaq(page?.faq), [page]);
  const { data: feed, isLoading: offersLoading } = useGroupOffers(page ? page.slug : null);
  const offers = useMemo(
    () => recentOffers(filterOffersByTerms(feed ?? [], parseOfferTerms(page?.offer_terms))),
    [feed, page]
  );
  const newest = offers.find(offer => offer.sentAt)?.sentAt ?? null;
  const modified = [newest, page?.updated_at].filter((date): date is string => Boolean(date)).sort().pop() ?? null;
  const updatedAt = formatUpdatedAt(modified);

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa]">
        <Header />
        <main className="mx-auto max-w-4xl space-y-4 px-4 py-8 md:py-12">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa]">
        <SEOHead title="Página não encontrada | Cuponito" description="Esta página de ofertas não existe." robots="noindex" />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-black">Página não encontrada</h1>
          <a href="/cupons" className="font-bold text-[#ff5200] hover:underline">
            Ver os cupons de hoje
          </a>
        </main>
      </div>
    );
  }

  const ctaTitle = groupCtaTitle(page, info, 'Receba as ofertas no WhatsApp');

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] font-sans">
      <SEOHead
        title={page.title}
        description={page.meta_description}
        canonical={`${SITE_URL}${pagePath(page)}`}
        ogImage={firstContentImage(page.content) ?? undefined}
        ogUpdatedTime={modified ?? undefined}
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
          <ArrowLeft size={14} /> Início
        </Link>

        <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#ff5200]">Ofertas de hoje</p>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">{page.h1}</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {author && (
              <>
                Por{' '}
                {authorProfileUrl(author) ? (
                  <a href={authorProfileUrl(author)!} target="_blank" rel="author noopener noreferrer" className="font-bold text-foreground hover:underline">
                    {author.name}
                  </a>
                ) : (
                  <strong className="text-foreground">{author.name}</strong>
                )}
                {author.job_title ? `, ${author.job_title}` : ''}
                {updatedAt ? ' · ' : ''}
              </>
            )}
            {updatedAt && <>Atualizado em {updatedAt}</>}
          </p>

          <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">{page.intro}</p>

          <GroupJoinCTA
            compact
            title={ctaTitle}
            text={groupFactsSentence(info)}
            groupSlug={page.slug}
            source="offers_page_top"
            context={page.slug}
            className="mb-10"
          />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-black text-foreground md:text-2xl">Ofertas de hoje</h2>
            {offersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : offers.length > 0 ? (
              <GroupOfferList offers={offers} />
            ) : (
              <p className="text-muted-foreground">
                As ofertas de hoje aparecem aqui assim que saem no grupo. Para receber na hora, entre no grupo.
              </p>
            )}
          </section>

          <div className="prose prose-sm max-w-none md:prose-base prose-headings:font-black prose-headings:text-[#1a1a1a] prose-a:font-bold prose-a:text-[#ff5200] prose-a:no-underline hover:prose-a:underline prose-img:w-full prose-img:rounded-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
          </div>

          {faq.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-black text-foreground md:text-2xl">Perguntas frequentes</h2>
              <div className="space-y-4">
                {faq.map(item => (
                  <div key={item.question}>
                    <h3 className="font-bold text-foreground">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <GroupJoinCTA title={ctaTitle} groupSlug={page.slug} source="offers_page_footer" context={page.slug} className="mt-10" />

          {siblings.length > 0 && (
            <nav aria-label="Veja também" className="mt-10">
              <h2 className="mb-3 text-xl font-black text-foreground md:text-2xl">Veja também</h2>
              <ul className="space-y-2">
                {siblings.map(other => (
                  <li key={other.slug}>
                    <a href={pagePath(other)} className="font-bold text-[#ff5200] hover:underline">
                      {other.h1}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <AuthorBox author={author} />
        </article>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
