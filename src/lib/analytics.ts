type AnalyticsEventName = 'coupon_click' | 'coupon_copy' | 'whatsapp_click' | 'search_submit' | 'experiment_exposure' | 'blog_coupon_cta_click';

interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

export function trackEvent(event: AnalyticsEventName, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') return;

  const entry = {
    event,
    payload: payload ?? {},
    ts: new Date().toISOString(),
  };

  // Lightweight local baseline for Phase 0 (can be replaced by GA/Plausible later).
  try {
    const key = `analytics:${event}`;
    const prev = Number(window.localStorage.getItem(key) ?? '0');
    window.localStorage.setItem(key, String(prev + 1));
  } catch {
    // noop for private mode / denied storage
  }

  // Optional integration point if GTM/dataLayer exists.
  const maybeDataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(maybeDataLayer)) {
    maybeDataLayer.push(entry);
  }
}
