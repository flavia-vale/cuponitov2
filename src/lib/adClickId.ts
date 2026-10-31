// Clique de anúncio do Google (`gclid`) que trouxe o visitante ao site. A URL do
// anúncio traz `?gclid=...` só na página de chegada; guardamos na sessão para o
// botão do grupo levar o identificador mesmo depois de a pessoa navegar no site.
// O /entrar grava com o clique, e a aba Captação exporta para o Google Ads.

import { sanitizeGclid } from './groupJoinTracking';

const STORAGE_KEY = 'cuponito_gclid';

export function currentGclid(search: string = typeof window === 'undefined' ? '' : window.location.search): string | null {
  const fromUrl = sanitizeGclid(new URLSearchParams(search).get('gclid'));
  try {
    if (fromUrl) {
      window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    return sanitizeGclid(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    // Sessão bloqueada (aba anônima, navegador restrito): vale só o da URL.
    return fromUrl;
  }
}
