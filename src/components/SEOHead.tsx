import { Helmet } from 'react-helmet-async';
import { useJsonLd, type JsonLdRoute } from '@/hooks/useJsonLd';
import { getMonthYear } from '@/lib/utils';

const BASE_URL = 'https://cuponito.com.br';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  jsonLdRoute: JsonLdRoute;
}

const SEOHead = ({ title, description, canonical, ogType = 'website', jsonLdRoute }: SEOHeadProps) => {
  const jsonLd = useJsonLd(jsonLdRoute);
  const canonicalUrl = canonical ?? BASE_URL;
  const monthYear = getMonthYear();

  // Substitui placeholders de data se existirem
  const finalTitle = title.replace('{month_year}', monthYear);
  const finalDescription = description.replace('{month_year}', monthYear);

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />

      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;