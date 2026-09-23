import InstitutionalLayout from './InstitutionalLayout';
import { faqs, institutionalMeta } from './content';
import { SITE_URL } from '@/lib/seo';

const meta = institutionalMeta.faq;

export default function FaqPage() {
  return (
    <InstitutionalLayout
      title={meta.title}
      description={meta.description}
      canonical={`${SITE_URL}${meta.path}`}
    >
      <div className="space-y-6">
        {faqs.map((faq) => (
          <section key={faq.question} className="rounded-2xl border border-border bg-[#f8f9fa] p-5">
            <h2 className="text-lg font-black text-foreground">{faq.question}</h2>
            <p className="mt-2">{faq.answer}</p>
          </section>
        ))}
      </div>
    </InstitutionalLayout>
  );
}
