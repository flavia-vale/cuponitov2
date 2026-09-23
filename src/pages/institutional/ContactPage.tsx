import InstitutionalLayout from './InstitutionalLayout';
import { contactMailto, contactParagraphs, institutionalMeta } from './content';
import { SITE_URL } from '@/lib/seo';

const meta = institutionalMeta.contact;

export default function ContactPage() {
  return (
    <InstitutionalLayout
      title={meta.title}
      description={meta.description}
      canonical={`${SITE_URL}${meta.path}`}
    >
      <p>{contactParagraphs[0]}</p>
      <p>{contactParagraphs[1]}</p>
      <p className="font-bold text-foreground">{contactParagraphs[2]}</p>
      <a
        href={contactMailto}
        className="inline-flex rounded-full bg-[#FF6B35] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#FF4D00]"
      >
        Enviar mensagem
      </a>
    </InstitutionalLayout>
  );
}
