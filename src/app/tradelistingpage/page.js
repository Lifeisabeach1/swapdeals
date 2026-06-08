// app/bytesannonser/page.js
import TradeListingsClient from './TradeListingsClient';
import { 
  metadata, 
  itemListJsonLd,
  collectionPageJsonLd,
  serviceJsonLd, 
  faqJsonLd, 
  breadcrumbJsonLd,
  webPageJsonLd 
} from './metadata';

// Export metadata for Next.js
export { metadata };

export default function BytesannonserPage() {
  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      
      {/* Main Content - Client Component */}
      <TradeListingsClient />
    </>
  );
}
