import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const distDir = 'dist';
const indexFile = join(distDir, 'index.html');

if (!existsSync(indexFile)) {
  throw new Error('dist/index.html não encontrado. Execute o build do Vite antes de criar os fallbacks da SPA.');
}

const spaFallbackPaths = [
  '404',
  'admin',
  'admin/login',
  'admin/access-denied',
  'admin/blog',
  'admin/coupons',
  'adminblog',
  'blog',
  'como-funciona',
  'cupons',
  'fale-conosco',
  'lojas',
  'perguntas-frequentes',
  'quem-somos',
  'termos-de-uso',
];

for (const routePath of spaFallbackPaths) {
  const htmlFile = join(distDir, `${routePath}.html`);
  mkdirSync(dirname(htmlFile), { recursive: true });
  copyFileSync(indexFile, htmlFile);

  if (routePath !== '404') {
    const directoryIndexFile = join(distDir, routePath, 'index.html');
    mkdirSync(dirname(directoryIndexFile), { recursive: true });
    copyFileSync(indexFile, directoryIndexFile);
  }
}
