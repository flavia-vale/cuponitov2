import InstitutionalLayout from './InstitutionalLayout';
import { institutionalMeta, termsIntro, termsSections } from './content';
import { SITE_URL } from '@/lib/seo';

const meta = institutionalMeta.terms;

export default function TermsPage() {
  return (
    <InstitutionalLayout
      title={meta.title}
      description={meta.description}
      canonical={`${SITE_URL}${meta.path}`}
    >
      <p>{termsIntro}</p>

      <div className="space-y-6">
        {termsSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-border bg-[#f8f9fa] p-5">
            <h2 className="text-lg font-black text-foreground">{section.title}</h2>
            <p className="mt-2">{section.content}</p>
          </section>
        ))}
      </div>
    </InstitutionalLayout>
  );
}
