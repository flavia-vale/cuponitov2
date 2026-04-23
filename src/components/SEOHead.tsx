import { Helmet } from 'react-helmet-async';
import { useJsonLd, type JsonLdRoute } from '@/hooks/useJsonLd';
import { getMonthYear } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  robots?: string;
  jsonLdRoute: JsonLdRoute;
}

const SEOHead = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  robots,
  jsonLdRoute,
}: SEOHeadProps) => {
  const jsonLd = useJsonLd(jsonLdRoute);
  const canonicalUrl = canonical ?? SITE_URL;
  const monthYear = getMonthYear();

  const finalTitle = title.replace('{month_year}', monthYear);
  const finalDescription = description.replace('{month_year}', monthYear);
  const finalImage = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {robots && <meta name="robots" content={robots} />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Cuponito" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
