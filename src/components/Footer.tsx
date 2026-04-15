import { Heart, Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const Footer = () => (
  <footer className="border-t border-border/60 bg-muted/30 py-8 md:py-10">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <Link to="/desconto/$slug" params={{ slug: 'cupom-desconto-amazon' }} className="transition hover:text-foreground">Amazon</Link>
          <span className="text-border">•</span>
          <Link to="/desconto/$slug" params={{ slug: 'cupom-desconto-shopee' }} className="transition hover:text-foreground">Shopee</Link>
          <span className="text-border">•</span>
          <Link to="/desconto/$slug" params={{ slug: 'cupom-desconto-mercado-livre' }} className="transition hover:text-foreground">Mercado Livre</Link>
        </div>
        
        <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          Feito com <Heart className="h-4 w-4 fill-accent text-accent" /> — Cupons atualizados diariamente
        </p>
        
        <p className="text-xs text-muted-foreground/70">
          Links de afiliado. Você não paga nada a mais por isso!
        </p>

        <div className="mt-4 pt-4 border-t border-border/40 w-full max-w-xs">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 transition hover:text-primary"
          >
            <Lock className="h-3 w-3" />
            Área Restrita
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;