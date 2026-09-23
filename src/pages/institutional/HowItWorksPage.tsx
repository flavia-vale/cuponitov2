import InstitutionalLayout from './InstitutionalLayout';
import { howItWorksClosing, howItWorksIntro, howItWorksSteps, institutionalMeta } from './content';
import { SITE_URL } from '@/lib/seo';

const meta = institutionalMeta.howItWorks;

export default function HowItWorksPage() {
  return (
    <InstitutionalLayout
      title={meta.title}
      description={meta.description}
      canonical={`${SITE_URL}${meta.path}`}
    >
      <p className="font-bold text-foreground">{howItWorksIntro}</p>
      <ol className="space-y-3">
        {howItWorksSteps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-sm font-black text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p>{howItWorksClosing[0]}</p>
      <p className="font-bold text-foreground">{howItWorksClosing[1]}</p>
    </InstitutionalLayout>
  );
}
