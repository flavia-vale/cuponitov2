/**
 * Dispara o IndexNow para as URLs informadas (caminhos relativos ou absolutos
 * do próprio domínio). Falha em silêncio: avisar o Bing é acessório, nunca
 * pode derrubar o salvamento de um post no painel.
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  try {
    await fetch('/api/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });
  } catch {
    // sem toast: é otimização de descoberta, não parte do fluxo de edição
  }
}
