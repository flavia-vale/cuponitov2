import { Helmet } from 'react-helmet-async';
import { useJsonLd, type JsonLdRoute } from '@/hooks/useJsonLd';

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

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
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
