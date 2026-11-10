import { useEffect, useState } from 'react';
import { buildJoinTrackingHref } from '@/lib/groupJoinTracking';
import { currentVisitSource } from '@/lib/visitSource';

const SITE_URL = 'https://www.cuponito.com.br';
const DESKTOP_QUERY = '(min-width: 768px) and (pointer: fine)';

/** Quadradinhos escuros do QR em um único `path` de SVG (sem HTML injetado). */
function qrPath(isDark: (row: number, col: number) => boolean, size: number): string {
  let d = '';
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (isDark(row, col)) d += `M${col} ${row}h1v1h-1z`;
    }
  }
  return d;
}

export interface GroupJoinQrProps {
  /** Origem do botão; o QR grava `<origem>_qr` na aba Captação. */
  source: string;
  groupSlug?: string | null;
  pagePath: string;
  /** Lado do QR em px. */
  size?: number;
  className?: string;
  /** Texto embaixo do QR. */
  label?: string;
}

/**
 * QR code do convite para quem está no computador: aponta a câmera do celular e o
 * WhatsApp abre lá (31% dos cliques são de desktop, plano de 10/11, frente C).
 * Passa pelo /entrar como os botões. Só carrega a biblioteca no computador.
 */
export default function GroupJoinQr({
  source,
  groupSlug = null,
  pagePath,
  size = 112,
  className = '',
  label = 'No computador? Aponte a câmera do celular',
}: GroupJoinQrProps) {
  const [qr, setQr] = useState<{ d: string; modules: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia?.(DESKTOP_QUERY).matches) return;
    let cancelled = false;
    const href = `${SITE_URL}${buildJoinTrackingHref({
      origin: `${source}_qr`,
      groupSlug,
      pagePath,
      visitSource: currentVisitSource(),
    })}`;
    import('qrcode-generator')
      .then(({ default: qrcode }) => {
        const code = qrcode(0, 'M');
        code.addData(href);
        code.make();
        const modules = code.getModuleCount();
        if (!cancelled) setQr({ d: qrPath((r, c) => code.isDark(r, c), modules), modules });
      })
      .catch(() => {
        // Sem QR: o botão continua funcionando.
      });
    return () => {
      cancelled = true;
    };
  }, [source, groupSlug, pagePath]);

  if (!qr) return null;

  return (
    <figure className={`hidden flex-col items-center gap-1.5 md:flex ${className}`}>
      <svg
        role="img"
        aria-label="QR code para entrar no grupo pelo celular"
        width={size}
        height={size}
        viewBox={`-2 -2 ${qr.modules + 4} ${qr.modules + 4}`}
        shapeRendering="crispEdges"
        className="rounded-lg bg-white"
      >
        <rect x={-2} y={-2} width={qr.modules + 4} height={qr.modules + 4} fill="#fff" />
        <path d={qr.d} fill="#111" />
      </svg>
      <figcaption className="max-w-[10rem] text-center text-[11px] font-semibold leading-tight text-white/90">{label}</figcaption>
    </figure>
  );
}
