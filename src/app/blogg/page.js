// app/blogg/page.js
import BlogClient from './BlogClient';
import { 
  generateMetadata, 
  viewport, 
  generateBlogJsonLd, 
  generateWebPageJsonLd, 
  generateBlogFaqJsonLd, 
  generateBreadcrumbJsonLd 
} from './metadata';

export { generateMetadata, viewport };

export default async function BlogPage({ searchParams }) {
  // ✅ Await searchParams before accessing properties
  const params = await searchParams;
  const cityKey = (params?.city || 'default').toLowerCase();
  
  // Generate all separate JSON-LD schemas
  const blogJsonLd = generateBlogJsonLd(cityKey);
  const webPageJsonLd = generateWebPageJsonLd(cityKey);
  const faqJsonLd = generateBlogFaqJsonLd(cityKey);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(cityKey);

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Main Content */}
      <BlogClient />
    </>
  );
}