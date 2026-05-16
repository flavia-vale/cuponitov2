import { trackEvent } from '@/lib/analytics';

const PREFIX = 'exp:';

type VariantMap = Record<string, string[]>;

const EXPERIMENTS: VariantMap = {
  hero_headline_v1: ['control', 'benefit'],
  coupon_cta_v1: ['control', 'action'],
  whatsapp_position_v1: ['footer_only', 'mid_and_footer'],
};

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}

export function getVariant(experiment: keyof typeof EXPERIMENTS): string {
  if (typeof window === 'undefined') return EXPERIMENTS[experiment][0];

  const key = `${PREFIX}${experiment}`;
  const stored = window.localStorage.getItem(key);
  if (stored && EXPERIMENTS[experiment].includes(stored)) return stored;

  const seed = window.location.hostname + navigator.userAgent;
  const variants = EXPERIMENTS[experiment];
  const assigned = variants[hash(`${experiment}:${seed}`) % variants.length];
  window.localStorage.setItem(key, assigned);
  return assigned;
}

export function trackExposure(experiment: keyof typeof EXPERIMENTS, variant: string) {
  trackEvent('experiment_exposure', { experiment, variant, event_kind: 'exposure' });
}
