import InstitutionalLayout from './InstitutionalLayout';

export default function ContactPage() {
  return (
    <InstitutionalLayout
      title="Fale conosco"
      description="Entre em contato com o time do Cuponito para avisar sobre cupons, sugerir lojas ou tirar dúvidas."
      canonical="https://www.cuponito.com.br/fale-conosco"
    >
      <p>Encontrou um cupom que não funcionou? Quer sugerir uma loja? Tem alguma dúvida que não está no FAQ?</p>
      <p>Manda mensagem aqui embaixo. O time do Cuponito lê tudo e te responde o mais rápido possível.</p>
      <p className="font-bold text-foreground">Adoramos ouvir, de verdade.</p>
      <a
        href="mailto:contato@cuponito.com.br?subject=Contato%20pelo%20Cuponito"
        className="inline-flex rounded-full bg-[#FF6B35] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#FF4D00]"
      >
        Enviar mensagem
      </a>
    </InstitutionalLayout>
  );
}
