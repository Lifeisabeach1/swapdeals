// app/alla-omdomen/page.js
import TestimonialCard from './AllTestimonialClient';
import { 
  metadata, 
  collectionPageJsonLd,
  serviceJsonLd, 
  faqJsonLd, 
  breadcrumbJsonLd,
  webPageJsonLd 
} from './metadata';

export { metadata };

export default function AllaOmdomenPage() {
  return (
    <>
      {/* JSON-LD Schema Markup */}
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
      
      {/* Main Content */}
      <TestimonialCard />
    </>
  );
}