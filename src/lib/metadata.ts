import type { Metadata } from "next";
import { isPublicSite, siteConfig } from "@/data/siteConfig";

/**
 * ページ metadata の組み立て
 *
 * NEXT_PUBLIC_SITE_URL が未設定のあいだは
 *   - canonical / OGPのURL を出力しない（誤ったドメインを正規版として伝えないため）
 *   - robots を noindex にする（プレビューURLの誤インデックス防止）
 * 本番ドメインを設定すれば、自動的にすべて有効になる。
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
