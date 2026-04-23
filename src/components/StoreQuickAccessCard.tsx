"use client";

import React from 'react';
import StoreIcon from './StoreIcon';
import { ExternalLink } from 'lucide-react';

interface Props {
  storeName: string;
  brandColor: string;
  logoUrl?: string | null;
  onVisit: () => void;
}

const StoreQuickAccessCard = ({ storeName, brandColor, logoUrl, onVisit }: Props) => {
  return (
    <div 
      className="group relative overflow-hidden bg-primary rounded-2xl p-6 text-white shadow-xl transition-all hover:shadow-primary/20"
      role="region"
      aria-label={`Acesso rápido à loja ${storeName}`}
    >
      {/* Elemento decorativo de fundo */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Container da Logo - Branco sólido para melhor contraste da marca */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-lg ring-4 ring-white/20">
          <StoreIcon 
            name={storeName} 
            brandColor={brandColor} 
            logoUrl={logoUrl} 
            size="lg" 
            className="bg-transparent border-none shadow-none p-0" 
          />
        </div>

        <h3 className="mb-2 text-lg font-black leading-tight tracking-tight">
          Ir direto para a {storeName}
        </h3>
        
        <p className="mb-6 text-sm font-medium text-white/90 leading-relaxed">
          Acesse o site oficial e economize agora com nossos cupons verificados.
        </p>

        <button 
          onClick={onVisit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black uppercase tracking-wide text-primary shadow-md transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]"
          aria-label={`Visitar site oficial da loja ${storeName}`}
        >
          Visitar Loja <ExternalLink size={16} />
        </button>
        
        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
          Redirecionamento Seguro
        </p>
      </div>
    </div>
  );
};

export default StoreQuickAccessCard;