import type { MetadataRoute } from "next";
import { isPublicSite, siteUrl } from "@/data/siteConfig";
import { visibleProducts } from "@/data/products";
import { columns } from "@/data/column";
import { guidePages, guidePath } from "@/data/lycheeGuide";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** 実際の更新日。持っていないページだけ undefined にする */
  lastModified?: Date;
};

/**
 * sitemap.xml
 *
 * ─────────────────────────────────────────────
 * 自動で載るもの
 * ─────────────────────────────────────────────
 * ・ライチ完全ガイド（data/lycheeGuide.ts）
 * ・商品（data/products.ts。draft は除外される）
 * ・コラム（data/column.ts。記事が0件なら一覧ごと載せない）
 * データを足すだけで反映されるので、ここを手で触る必要はない。
 *
 * ─────────────────────────────────────────────
 * lastModified の扱い
 * ─────────────────────────────────────────────
 * 記事とガイドは、データに書かれた実際の更新日を使う。
 * ビルドのたびに今日の日付を入れて「更新したように見せる」ことはしない。
 * 更新日を持たないページ（カテゴリ一覧など）は lastModified を出力しない。
 *
 * ─────────────────────────────────────────────
 * 載せないもの
 * ─────────────────────────────────────────────
 * カート・購入手続き・APIは検索結果に出す意味がないため含めない。
 * （robots.txt でも Disallow にしている）
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];

  const staticEntries: Entry[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.95, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/access", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/news", priority: 0.6, changeFrequency: "weekly" },
    { path: "/guide", priority: 0.6, changeFrequency: "monthly" },
    { path: "/shipping", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  /** ライチ完全ガイド。ピラーページを最上位に置く */
  const guideEntries: Entry[] = guidePages.map((page) => ({
    path: guidePath(page.slug),
    priority: page.slug === "" ? 0.95 : 0.85,
    changeFrequency: "monthly",
    lastModified: new Date(page.updatedAt),
  }));

  const productEntries: Entry[] = visibleProducts.map((product) => ({
    path: `/products/${product.slug}`,
    priority: 0.9,
    changeFrequency: "weekly",
  }));

  /** コラムは記事があるときだけ、一覧と記事を載せる */
  const columnEntries: Entry[] =
    columns.length === 0
      ? []
      : [
          {
            path: "/column",
            priority: 0.6,
            changeFrequency: "weekly" as const,
          },
          ...columns.map((article) => ({
            path: `/column/${article.slug}`,
            priority: 0.6,
            changeFrequency: "monthly" as const,
            lastModified: new Date(article.updated ?? article.date),
          })),
        ];

  return [
    ...staticEntries,
    ...guideEntries,
    ...productEntries,
    ...columnEntries,
  ].map((entry) => ({
    url: `${siteUrl}${entry.path === "/" ? "" : entry.path}`,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
