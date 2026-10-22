// Cupom vencido não aparece no site. Módulo puro: o React (supabase-js) e o
// prerender do Edge (REST) aplicam o MESMO filtro, para o HTML do servidor e a
// página montada não divergirem.
//
// Em 22/10/2026, 16.419 dos 16.626 cupons tinham `status = true` com `expiry`
// no passado: a rotina diária que desativa vencidos estava desligada desde
// maio. O filtro na leitura não depende dela rodar.

/** Filtro PostgREST para `.or()`: sem validade ou validade de agora em diante. */
export function notExpiredFilter(now: Date = new Date()): string {
  return `expiry.is.null,expiry.gte.${now.toISOString()}`;
}
