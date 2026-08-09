import type { Metadata } from "next";
import { isPublicSite, siteConfig } from "@/data/siteConfig";

/**
 * ページ metadata の組み立て
 *
 * canonical・OGPのURLは data/siteConfig.ts の siteUrl（本番ドメイン）を基準にする。
 * isPublicSite を false にすると、canonical/OGPを出さず noindex になる
 * （公開前に一時的にサイト全体を隠したいときのスイッチ）。
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
}: {
  /** ページ固有のタイトル（サイト名はテンプレートで自動的に付く） */
  title: string;
  /** 120文字以内を目安に、検索意図に沿って書く */
  description: string;
  /** 先頭スラッシュ付きのパス。例: "/shop" */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title: `${title}｜${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      locale: "ja_JP",
      type,
      ...(isPublicSite ? { url: path } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜${siteConfig.name}`,
      description,
    },
    ...(isPublicSite
      ? { alternates: { canonical: path }, robots: { index: true, follow: true } }
      : { robots: { index: false, follow: false } }),
  };
}
