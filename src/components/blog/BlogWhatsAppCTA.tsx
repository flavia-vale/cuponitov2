"use client";

import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const BlogWhatsAppCTA = () => {
  const { data: settings } = useSettings();
  const whatsappLink = settings?.global_links.whatsapp_group || '#';

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-5 sm:p-6 shadow-xl shadow-green-500/20">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
            <MessageCircle size={28} className="fill-white text-[#128C7E]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black leading-tight text-white">Cupons em tempo real!</h3>
            <p className="text-xs font-medium text-white/90">Receba ofertas relâmpago direto no seu celular.</p>
          </div>
        </div>
        
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="nofollow noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black uppercase tracking-wide text-[#128C7E] transition-all hover:scale-105 hover:bg-gray-50 active:scale-95 shadow-md"
        >
          <Zap size={16} className="fill-current" /> Entrar no Grupo
        </a>
      </div>
    </section>
  );
};

export default BlogWhatsAppCTA;