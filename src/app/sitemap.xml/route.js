// src/app/sitemap.xml/route.js
import { NextResponse } from "next/server";

const baseUrl = "https://swapdeals.se";

// All routes matching your folder structure
const staticRoutes = [
  "/",
  "/kontakt",
  "/swapdeals-guide",
  "/tradeform",
  "/tradelistingpage",
  "/tradedetailpage",
  "/my-trades",
  "/hallbar-konsumtion",
  "/hallbarhet",
  "/testimonial",
  "/alla-omdomen",
  "/privacy",
  "/terms",
  "/swapdeal-stockholm",
  "/swapdeal-goteborg",
  "/swapdeal-malmo",
  "/swapdeal-uppsala",
  "/swapdeal-linkoping",
  "/swapdeal-vasteras",
  "/swapdeal-orebro",
  "/newtradescarousel",
  "/second-hand",
  "/blogg",
  "/contexts",
  "/conversations",
  "/api",
];

// Priority & change frequency optimized for SEO
const priorityMap = {
  "/": { priority: "1.0", changefreq: "daily" },
  "/tradelistingpage": { priority: "0.9", changefreq: "hourly" },
  "/tradeform": { priority: "0.9", changefreq: "weekly" },
  "/swapdeal-stockholm": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-goteborg": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-malmo": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-uppsala": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-linkoping": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-vasteras": { priority: "0.9", changefreq: "daily" },
  "/swapdeal-orebro": { priority: "0.9", changefreq: "daily" },
  "/swapdeals-guide": { priority: "0.8", changefreq: "monthly" },
  "/kontakt": { priority: "0.8", changefreq: "monthly" },
  "/hallbar-konsumtion": { priority: "0.8", changefreq: "monthly" },
  "/hallbarhet": { priority: "0.8", changefreq: "monthly" },
  "/my-trades": { priority: "0.7", changefreq: "daily" },
  "/alla-omdomen": { priority: "0.7", changefreq: "weekly" },
  "/testimonial": { priority: "0.6", changefreq: "weekly" },
  "/privacy": { priority: "0.5", changefreq: "yearly" },
  "/terms": { priority: "0.5", changefreq: "yearly" },
  "/tradedetailpage": { priority: "0.7", changefreq: "daily" },
  "/newtradescarousel": { priority: "0.6", changefreq: "daily" },
  "/second-hand": { priority: "0.7", changefreq: "weekly" },
  "/blogg": { priority: "0.8", changefreq: "weekly" },
};

export const dynamic = "force-static";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const urls = staticRoutes
    .map((route) => {
      const config = priorityMap[route] || { priority: "0.6", changefreq: "monthly" };
      return `
  <url>
    <loc>${baseUrl}${route === "/" ? "" : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
