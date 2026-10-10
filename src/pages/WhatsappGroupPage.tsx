import { lazy, Suspense, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import GroupJoinCTA from '@/components/GroupJoinCTA';
import AuthorBox from '@/components/blog/AuthorBox';
import { useBlogAuthors } from '@/hooks/useBlog';
import { authorProfileUrl, isFlavia } from '@/lib/authors';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/hooks/useSettings';
import { useWhatsappGroupInfo, useWhatsappGroupPages } from '@/hooks/useWhatsappGroupPages';
import { SITE_URL } from '@/lib/seo';
import {
  GROUP_BASE_PATH,
  GROUP_HUB_SLUG,
  firstContentImage,
  groupPagePath,
  parseGroupFaq,
  resolveJoinUrl,
} from '@/lib/whatsappGroup';

const Footer = lazy(() => import('@/components/Footer'));

interface WhatsappGroupPageProps {
  /** Sem slug = página principal (/grupo-whatsapp). */
  slug?: string;
}

function formatUpdatedAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
}

export default function WhatsappGroupPage({ slug = GROUP_HUB_SLUG }: WhatsappGroupPageProps) {
  const { data: pages, isLoading } = useWhatsappGroupPages();
  const { data: settings } = useSettings();
  const info = useWhatsappGroupInfo();
  const { data: authors } = useBlogAuthors();
  const author = useMemo(() => authors?.find(item => isFlavia(item.name)) ?? null, [authors]);

  const page = useMemo(() => pages?.find(item => item.slug === slug), [pages, slug]);
  const siblings = useMemo(() => (pages ?? []).filter(item => item.slug !== slug), [pages, slug]);
  const faq = useMemo(() => parseGroupFaq(page?.faq), [page]);
  const joinUrl = resolveJoinUrl(page, settings?.global_links.whatsapp_group);
  const isHub = slug === GROUP_HUB_SLUG;
  const canonical = `${SITE_URL}${groupPagePath(slug)}`;
  const updatedAt = formatUpdatedAt(page?.updated_at);

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
        <SEOHead title="Página não encontrada | Cuponito" description="Esta página do grupo não existe." robots="noindex" />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-black">Página não encontrada</h1>
          <Link to={GROUP_BASE_PATH} className="font-bold text-[#ff5200] hover:underline">
            Ver o grupo de ofertas no WhatsApp
          </Link>
        </main>
      </div>
    );
  }

  const facts = [
    { label: 'Grupo', value: info.group_name },
    { label: 'Preço', value: 'grátis' },
    { label: 'Ofertas por dia', value: info.offers_per_day },
    { label: 'Lojas', value: info.stores },
    ...(info.admins_only ? [{ label: 'Quem posta', value: 'só os administradores' }] : []),
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] font-sans">
      <SEOHead
        title={page.title}
        description={page.meta_description}
        canonical={canonical}
        ogImage={firstContentImage(page.content) ?? undefined}
        ogUpdatedTime={page.updated_at}
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link
          to={isHub ? '/' : GROUP_BASE_PATH}
          className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline"
        >
          <ArrowLeft size={14} /> {isHub ? 'Início' : 'Grupo no WhatsApp'}
        </Link>

        <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#ff5200]">Grupo no WhatsApp</p>
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

          <ul className="mb-6 grid grid-cols-1 gap-2 rounded-2xl bg-[#f8f9fa] p-4 text-sm sm:grid-cols-2 md:text-base">
            {facts.map(fact => (
              <li key={fact.label} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.17_150)]" />
                <span>
                  <strong className="text-foreground">{fact.label}:</strong> {fact.value}
                </span>
              </li>
            ))}
          </ul>

          <GroupJoinCTA
            title="Entrar no grupo de ofertas"
            text={info.channel_url ? 'Toque no botão e o WhatsApp abre o convite. Prefere não aparecer para ninguém? Siga o canal.' : 'Toque no botão e o WhatsApp abre o convite.'}
            href={joinUrl}
            source="group_page"
            context={page.slug}
            className="mb-10"
          />

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

          <GroupJoinCTA title="Pronto para economizar?" href={joinUrl} source="group_page_footer" context={page.slug} className="mt-10" />

          {siblings.length > 0 && (
            <nav aria-label="Outras páginas do grupo" className="mt-10">
              <h2 className="mb-3 text-xl font-black text-foreground md:text-2xl">Outras páginas do grupo</h2>
              <ul className="space-y-2">
                {siblings.map(other => (
                  <li key={other.slug}>
                    <a href={groupPagePath(other.slug)} className="font-bold text-[#ff5200] hover:underline">
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
