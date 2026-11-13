import { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { SITE_URL } from '@/lib/seo';

/**
 * QR code do botão do grupo, só no computador: o clique no desktop abre o
 * WhatsApp Web e quase não vira entrada. Apontando a câmera, o convite abre no
 * celular. O código leva ao /entrar (mede a origem `<origem>_qr`), nunca ao
 * convite direto. Gerado aqui, sem serviço externo.
 */
export default function JoinQrCode({ href, size = 132, className = '' }: { href: string; size?: number; className?: string }) {
  const svg = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(new URL(href, SITE_URL).toString());
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [href]);

  return (
    <div className={`hidden shrink-0 items-center gap-3 rounded-2xl bg-white p-3 text-left text-[#128C7E] lg:flex ${className}`}>
      <div
        className="shrink-0 [&>svg]:h-full [&>svg]:w-full"
        style={{ width: size, height: size }}
        role="img"
        aria-label="QR code para entrar no grupo pelo celular"
        // SVG gerado aqui a partir do endereço do próprio site.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="max-w-[9rem] text-xs font-bold leading-snug">
        No computador? Aponte a câmera do celular e entre pelo WhatsApp do celular.
      </p>
    </div>
  );
}
