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
        disallow: ["/cart", "/checkout", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
