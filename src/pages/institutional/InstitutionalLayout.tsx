import { lazy, Suspense, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';

const Footer = lazy(() => import('@/components/Footer'));

interface InstitutionalLayoutProps {
  title: string;
  description: string;
  canonical: string;
  eyebrow?: string;
  children: ReactNode;
}

export default function InstitutionalLayout({
  title,
  description,
  canonical,
  eyebrow = 'Cuponito',
  children,
}: InstitutionalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
<<<<<<< ours
      <SEOHead title={`${title} | Cuponito`} description={description} canonical={canonical} />
=======
      <SEOHead title={`${title} | Cuponito`} description={description} canonical={canonical} jsonLdRoute={{ type: 'generic' }} />
>>>>>>> theirs
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
          <ArrowLeft size={14} /> Início
        </Link>

        <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#ff5200]">{eyebrow}</p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground md:text-5xl">{title}</h1>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">{children}</div>
        </article>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
