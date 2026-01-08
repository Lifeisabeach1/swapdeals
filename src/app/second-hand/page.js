// app/hallbarhet/page.js
import SecondhandClient from './SecondhandClient';
import { 
  metadata, 
  articleJsonLd,
  howToJsonLd,
  faqJsonLd, 
  breadcrumbJsonLd,
  webPageJsonLd,
  organizationJsonLd 
} from './metadata';

export { metadata };

export default function HallbarhetPage() {
  return (
    <>
      {/* JSON-LD Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      
      {/* Main Blog Post Content */}
      <SecondhandClient />
    </>
  );
}