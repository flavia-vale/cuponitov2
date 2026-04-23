"use client";

import React from 'react';
import StoreIcon from './StoreIcon';

interface Props {
  storeName: string;
  brandColor: string;
  logoUrl?: string | null;
  onVisit: () => void;
}

const StoreQuickAccessCard = ({ storeName, brandColor, logoUrl, onVisit }: Props) => {
  return (
    <div className="bg-primary rounded-2xl p-[18px] text-center text-white shadow-lg">
      <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
        <StoreIcon 
          name={storeName} 
          brandColor={brandColor} 
          logoUrl={logoUrl} 
          size="md" 
          className="bg-transparent border-none shadow-none" 
        />
      </div>
      <h3 className="text-[15px] font-bold mb-1.5">Ir direto para a {storeName}</h3>
      <p className="text-xs text-white/80 mb-4 leading-relaxed">
        Acesse a loja agora e use um dos nossos cupons para economizar na sua compra.
      </p>
      <button 
        onClick={onVisit}
        className="bg-white text-primary border-none rounded-xl p-[11px] text-[13px] font-bold cursor-pointer w-full hover:bg-gray-50 transition-all active:scale-95"
      >
        Visitar {storeName} ↗
      </button>
      <div className="text-[10px] text-white/60 mt-2">Você será redirecionado para o site oficial</div>
    </div>
  );
};

export default StoreQuickAccessCard;