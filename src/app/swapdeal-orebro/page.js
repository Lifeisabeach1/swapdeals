// app/swapdeal-stockholm/page.js
import HeroClient from './HeroClient';
import { 
  metadata,
  localBusinessJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  collectionPageJsonLd
} from './metadata';

export { metadata };

export default function SwapDealStockholmPage() {
  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      
      {/* Main Content */}
      <HeroClient />
    </>
  );
}