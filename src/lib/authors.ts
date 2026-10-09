// Autoras do Cuponito para EEAT: o mesmo schema Person no HTML do servidor
// (prerender) e no React, para Google e IAs lerem a MESMA entidade.
// Módulo puro: o prerender do Edge importa daqui.

import { safeExternalUrl } from './whatsappGroup';

const SITE_URL = 'https://www.cuponito.com.br';

export const FLAVIA_VALE_NAME = 'Flávia Vale';
export const FLAVIA_VALE_LINKEDIN = 'https://www.linkedin.com/in/flaviavale/';

/**
 * `@id` CITADO pelo Espelha Grupos (wabot: FOUNDER_PERSON_ID_PATH). Trocar aqui
 * sem trocar lá parte a entidade "Flávia Vale" entre os dois domínios.
 */
export const FLAVIA_VALE_PERSON_ID = 'https://espelhagrupos.com.br/quem-somos#person';

export interface AuthorProfile {
  name: string;
  bio?: string | null;
  linkedin_url?: string | null;
  job_title?: string | null;
  avatar_url?: string | null;
}

export function isFlavia(name: string | null | undefined): boolean {
  return (name ?? '').trim().toLowerCase() === FLAVIA_VALE_NAME.toLowerCase();
}

/** LinkedIn do banco; para a Flávia, o conhecido serve de reserva (banco sem a migration). */
export function authorProfileUrl(author: AuthorProfile | null | undefined): string | null {
  const url = safeExternalUrl(author?.linkedin_url);
  if (url) return url;
  return isFlavia(author?.name) ? FLAVIA_VALE_LINKEDIN : null;
}

export function authorPersonSchema(author: AuthorProfile | null | undefined): Record<string, unknown> {
  if (!author?.name) return { '@type': 'Organization', name: 'Cuponito', url: `${SITE_URL}/` };

  const profileUrl = authorProfileUrl(author);
  const base: Record<string, unknown> = {
    '@type': 'Person',
    name: author.name,
    ...(author.job_title ? { jobTitle: author.job_title } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(safeExternalUrl(author.avatar_url) ? { image: safeExternalUrl(author.avatar_url) } : {}),
  };

  if (isFlavia(author.name)) {
    return {
      ...base,
      '@id': FLAVIA_VALE_PERSON_ID,
      url: 'https://espelhagrupos.com.br/quem-somos',
      sameAs: [
        'https://espelhagrupos.com.br/quem-somos',
        `${SITE_URL}/quem-somos`,
        ...(profileUrl ? [profileUrl] : []),
      ],
    };
  }

  return {
    ...base,
    ...(profileUrl ? { url: profileUrl, sameAs: [profileUrl] } : {}),
  };
}
