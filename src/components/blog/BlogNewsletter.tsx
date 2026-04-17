import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const BlogNewsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: 'Inscrição realizada!', description: 'Você receberá nossos melhores cupons por e-mail.' });
      setEmail('');
    }
  };

  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#FFF0EB] to-[#FFD8C8] border border-[#FFCAB0] p-8 text-center shadow-sm">
      <h3 className="text-lg font-black text-[#B83000] mb-2">Receba os melhores cupons por e-mail</h3>
      <p className="text-sm text-[#cc4400] mb-6 leading-relaxed max-w-md mx-auto">
        Toda semana enviamos os cupons mais quentes direto para você, sem spam.
      </p>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-white border-[#FFCAB0] rounded-2xl focus-visible:ring-primary/20"
          required
        />
        <Button type="submit" className="h-12 px-8 bg-[#FF4D00] hover:bg-[#D83C00] text-white font-bold rounded-2xl shadow-lg shadow-primary/20">
          Inscrever
        </Button>
      </form>
    </section>
  );
};

export default BlogNewsletter;