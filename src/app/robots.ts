import type { MetadataRoute } from "next";
import { isPublicSite, siteUrl } from "@/data/siteConfig";

/**
 * robots.txt
 *
 * 本番ドメイン（NEXT_PUBLIC_SITE_URL）が未設定のあいだは全ページを Disallow にする。
 * Vercel のプレビューURLが検索結果に出てしまうのを構造的に防ぐため。
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
        disallow: ["/cart", "/checkout", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
