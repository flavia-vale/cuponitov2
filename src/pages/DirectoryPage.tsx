import { lazy, Suspense, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Send } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import AuthorBox from '@/components/blog/AuthorBox';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogAuthors } from '@/hooks/useBlog';
import { useWhatsappGroupInfo, useWhatsappGroupPages } from '@/hooks/useWhatsappGroupPages';
import { trackEvent } from '@/lib/analytics';
import { currentGclid } from '@/lib/adClickId';
import { authorProfileUrl, isFlavia } from '@/lib/authors';
import { buildJoinTrackingHref } from '@/lib/groupJoinTracking';
import { SITE_URL } from '@/lib/seo';
import {
  buildDirectorySections,
  DIRECTORY_PATH,
  firstContentImage,
  isDirectoryPage,
  parseGroupFaq,
  type DirectoryGroup,
} from '@/lib/whatsappGroup';

const Footer = lazy(() => import('@/components/Footer'));

function formatUpdatedAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
}

function GroupCard({ group, gclid }: { group: DirectoryGroup; gclid: string | null }) {
  const join = buildJoinTrackingHref({ origin: 'directory', groupSlug: group.slug, pagePath: DIRECTORY_PATH, gclid });
  const telegram = group.hasTelegram
    ? buildJoinTrackingHref({ origin: 'directory', groupSlug: group.slug, pagePath: DIRECTORY_PATH, channel: 'telegram', gclid })
    : null;
  return (
    <div id={group.slug} className="flex scroll-mt-24 flex-col rounded-2xl border border-border bg-[#f8f9fa] p-5">
      <h3 className="text-lg font-black text-foreground">{group.name}</h3>
      <ul className="mt-2 flex-1 space-y-1 text-sm text-muted-foreground">
        <li>
          <strong className="text-foreground">O que chega:</strong> {group.topics}
        </li>
        <li>
          <strong className="text-foreground">Quantas ofertas:</strong> {group.volume || 'não informado'}
        </li>
        <li>
          <strong className="text-foreground">Plataforma:</strong> WhatsApp{group.hasTelegram ? ' e Telegram' : ''} · grátis · só os
          administradores postam
        </li>
      </ul>
      {group.pagePath && (
        <a href={group.pagePath} className="mt-3 text-sm font-bold text-[#ff5200] hover:underline">
          Ver a página do grupo e as ofertas de hoje
        </a>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={join}
          target="_blank"
          rel="nofollow noopener"
          onClick={() => trackEvent('whatsapp_click', { source: 'directory', context: group.slug })}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow transition-transform hover:scale-[1.02] active:scale-95"
        >
          Entrar no grupo
        </a>
        {telegram && (
          <a
            href={telegram}
            target="_blank"
            rel="nofollow noopener"
            onClick={() => trackEvent('whatsapp_click', { source: 'directory_telegram', context: group.slug })}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#229ED9] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Send className="h-4 w-4" /> Prefere Telegram?
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * /grupos-de-promocao: todos os grupos do Cuponito por assunto, com o que chega,
 * quantas ofertas e o botão de entrar. Mesmo conteúdo do HTML do servidor
 * (`renderDirectoryPage`).
 */
export default function DirectoryPage() {
  // Com rascunhos: página despublicada pode guardar só o link de um grupo (ex.: festas).
  const { data: pages, isLoading } = useWhatsappGroupPages({ includeDrafts: true });
  const globalInfo = useWhatsappGroupInfo();
  const { data: authors } = useBlogAuthors();
  const author = useMemo(() => authors?.find(item => isFlavia(item.name)) ?? null, [authors]);
  const page = useMemo(() => pages?.find(item => isDirectoryPage(item) && item.is_published), [pages]);
  const sections = useMemo(() => buildDirectorySections(pages ?? [], globalInfo), [pages, globalInfo]);
  const faq = useMemo(() => parseGroupFaq(page?.faq), [page]);
  const gclid = currentGclid();
  const updatedAt = formatUpdatedAt(page?.updated_at);

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa]">
        <Header />
        <main className="mx-auto max-w-5xl space-y-4 px-4 py-8 md:py-12">
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
        <SEOHead title="Página não encontrada | Cuponito" description="Esta página não existe." robots="noindex" />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-black">Página não encontrada</h1>
          <a href="/grupo-whatsapp" className="font-bold text-[#ff5200] hover:underline">
            Ver o grupo de ofertas no WhatsApp
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] font-sans">
      <SEOHead
        title={page.title}
        description={page.meta_description}
        canonical={`${SITE_URL}${DIRECTORY_PATH}`}
        ogImage={firstContentImage(page.content) ?? undefined}
        ogUpdatedTime={page.updated_at ?? undefined}
      />
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
          <ArrowLeft size={14} /> Início
        </Link>

        <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#ff5200]">Grupos de promoção</p>
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

          <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg">{page.intro}</p>

          {sections.length > 1 && (
            <nav aria-label="Assuntos" className="mb-8 flex flex-wrap gap-2">
              {sections.map(section => (
                <a
                  key={section.name}
                  href={`#${section.groups[0].slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm font-bold text-foreground hover:border-[#ff5200] hover:text-[#ff5200]"
                >
                  {section.name}
                </a>
              ))}
            </nav>
          )}

          {sections.map(section => (
            <section key={section.name} className="mb-10">
              <h2 className="mb-4 text-xl font-black text-foreground md:text-2xl">{section.name}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {section.groups.map(group => (
                  <GroupCard key={group.slug} group={group} gclid={gclid} />
                ))}
              </div>
            </section>
          ))}

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

          <AuthorBox author={author} />
        </article>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
