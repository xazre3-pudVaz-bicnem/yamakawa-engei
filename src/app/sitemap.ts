import type { MetadataRoute } from "next";
import { isPublicSite, siteUrl } from "@/data/siteConfig";
import { visibleProducts } from "@/data/products";
import { columns } from "@/data/column";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

/**
 * sitemap.xml
 *
 * 商品（data/products.ts）とコラム（data/column.ts）は配列から自動生成するので、
 * データを追加すればサイトマップにも自動で載る。
 * カート・購入手続きは検索結果に出す意味がないため含めない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];

  const now = new Date();

  const staticEntries: Entry[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.95, changeFrequency: "weekly" },
    { path: "/lychee", priority: 0.9, changeFrequency: "monthly" },
    { path: "/how-to-eat", priority: 0.85, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/access", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/column", priority: 0.7, changeFrequency: "weekly" },
    { path: "/news", priority: 0.6, changeFrequency: "weekly" },
    { path: "/guide", priority: 0.6, changeFrequency: "monthly" },
    { path: "/shipping", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const productEntries: Entry[] = visibleProducts.map((product) => ({
    path: `/products/${product.slug}`,
    priority: 0.9,
    changeFrequency: "weekly",
  }));

  const columnEntries: Entry[] = columns.map((article) => ({
    path: `/column/${article.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: new Date(article.updated ?? article.date),
  }));

  return [...staticEntries, ...productEntries, ...columnEntries].map(
    (entry) => ({
      url: `${siteUrl}${entry.path === "/" ? "" : entry.path}`,
      lastModified: entry.lastModified ?? now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }),
  );
}
