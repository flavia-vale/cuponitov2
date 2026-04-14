import { Link } from '@tanstack/react-router';
import { ExternalLink, ArrowRight } from 'lucide-react';

export interface CtaConfig {
  title?: string;
  description?: string;
  button_text?: string;
  url?: string;
  store_slug?: string;
  color?: string;
}

interface Props {
  config: CtaConfig;
}

const BlogCtaBanner = ({ config }: Props) => {
  const {
    title = 'Confira os melhores cupons!',
    description,
    button_text = 'Ver cupons',
    url,
    store_slug,
    color = 'oklch(0.55 0.25 285)',
  } = config;

  const isExternal = !!url;
  const href = url || (store_slug ? `/desconto/${store_slug}` : '/');

  const content = (
    <div
      className="my-6 flex flex-col items-center gap-3 rounded-2xl p-6 text-center text-white sm:flex-row sm:justify-between sm:text-left"
      style={{ backgroundColor: color }}
    >
      <div>
        <p className="text-base font-bold sm:text-lg">{title}</p>
        {description && <p className="mt-1 text-sm text-white/80">{description}</p>}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30">
        {button_text}
        {isExternal ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="nofollow sponsored noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link to={href as '/'}>{content}</Link>;
};

export default BlogCtaBanner;
