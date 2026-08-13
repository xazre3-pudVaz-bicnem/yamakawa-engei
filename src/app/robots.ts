import type { MetadataRoute } from "next";
import { isPublicSite, siteUrl } from "@/data/siteConfig";

/**
 * robots.txt
 *
 * siteConfig の isPublicSite を false にすると全ページ Disallow になる
 * （公開前に一時的にサイト全体を隠したいときのスイッチ）。
 * カート・購入手続き・API はインデックス対象にしない。
 */
export default function robots(): MetadataRoute.Robots {
  if (!isPublicSite) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 購入フローと API は検索結果に出す意味がない。
        // 各ページ側でも noindex を設定している（robots.txt だけに頼らない）。
        disallow: ["/cart", "/checkout", "/order/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
