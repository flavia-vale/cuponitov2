import { Link } from '@tanstack/react-router';
import { ShoppingCart, ShoppingBag, Handshake, ArrowRight } from 'lucide-react';

const stores = [
  {
    key: 'mercado-livre',
    label: 'Mercado Livre',
    icon: Handshake,
    slug: 'cupom-desconto-mercado-livre',
    description: 'Descontos exclusivos com Pix e parcelamento',
    gradient: 'from-[oklch(0.88_0.18_95)] to-[oklch(0.75_0.18_95)]',
    iconBg: 'bg-black/10',
    featured: true,
  },
  {
    key: 'amazon',
    label: 'Amazon',
    icon: ShoppingCart,
    slug: 'cupom-desconto-amazon',
    description: 'Cupons de desconto para eletrônicos, livros e mais',
    gradient: 'from-[oklch(0.75_0.18_70)] to-[oklch(0.65_0.18_70)]',
    iconBg: 'bg-white/20',
    featured: false,
  },
  {
    key: 'shopee',
    label: 'Shopee',
    icon: ShoppingBag,
    slug: 'cupom-desconto-shopee',
    description: 'Ofertas e frete grátis nas melhores lojas',
    gradient: 'from-[oklch(0.7_0.2_40)] to-[oklch(0.58_0.2_40)]',
    iconBg: 'bg-white/20',
    featured: false,
  },
];

const StoreCards = () => (
  <section id="lojas" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
    <h2 className="mb-4 md:mb-6 text-center text-xl font-bold text-foreground md:text-3xl">
      Escolha sua loja favorita
    </h2>
    <div className="grid grid-cols-2 gap-3 sm:gap-5">
      {stores.map((store, i) => {
        const Icon = store.icon;
        return (
          <Link
            key={store.key}
            to="/desconto/$slug"
            params={{ slug: store.slug }}
            aria-label={`Ver cupons de desconto ${store.label}`}
            className={`group relative overflow-hidden rounded-2xl p-3 sm:p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-fade-in ${store.featured ? 'col-span-2' : ''}`}
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div className={`bg-gradient-to-br ${store.gradient} absolute inset-0`} />
            <div className="relative z-10">
              <div className={`mb-2 sm:mb-4 inline-flex rounded-xl ${store.iconBg} p-2 sm:p-3`}>
                <Icon className={`${store.featured ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-5 w-5 sm:h-7 sm:w-7'}`} />
              </div>
              <h3 className={`mb-0.5 sm:mb-1 font-bold ${store.featured ? 'text-base sm:text-2xl' : 'text-sm sm:text-xl'}`}>{store.label}</h3>
              <p className={`mb-2 sm:mb-4 text-xs sm:text-sm ${store.key === 'mercado-livre' ? 'text-black/60' : 'text-white/80'} line-clamp-2`}>
                {store.description}
              </p>
              <span className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold ${store.key === 'mercado-livre' ? 'text-black/80' : 'text-white/90'} group-hover:gap-2 transition-all`}>
                Ver cupons <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

export default StoreCards;
