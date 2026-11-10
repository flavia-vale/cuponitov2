// Fonte da visita (Google, ChatGPT, diretório…) guardada no cookie `cpn_src` pelo script
// do index.html na chegada. O /entrar lê o cookie direto; aqui o React lê para o QR code,
// que é escaneado em outro aparelho e leva a fonte na URL.

import { readVisitSourceCookie } from './groupJoinTracking';

export function currentVisitSource(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    return readVisitSourceCookie(document.cookie);
  } catch {
    return null;
  }
}
