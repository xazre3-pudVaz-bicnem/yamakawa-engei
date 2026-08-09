import path from "path";
import type { NextConfig } from "next";

/**
 * 旧URLの転送
 *
 * ライチの解説を /lychee 配下のガイドへ再編したときに、
 * 役目を引き継いだページへ恒久転送（301）している。
 *
 * ・古いURLに付いていた被リンクと評価を、新しいページへ引き継ぐため。
 * ・すでにブックマークしている方を404に落とさないため。
 *
 * 一度公開したURLは消さずに、必ずここへ転送先を書くこと。
 * permanent: true は301（恒久的な移動）を意味する。
 */
const redirects: Array<{ source: string; destination: string }> = [
  // 食べ方と保存方法を、検索意図ごとに2ページへ分割した
  { source: "/how-to-eat", destination: "/lychee/how-to-eat" },

  // コラムのライチ解説記事は、ガイドの該当ページへ統合した
  { source: "/column/lychee-season", destination: "/lychee/season" },
  { source: "/column/lychee-as-a-gift", destination: "/lychee/gift" },
  { source: "/column/ibusuki-tropical-fruit", destination: "/lychee/ibusuki" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // ヒーロー・商品写真はやや高品質で配信する。
    // ここに列挙した値以外の quality を <Image> に渡すと最適化エンドポイントが400を返す。
    qualities: [75, 82],
  },
  async redirects() {
    return redirects.map((rule) => ({ ...rule, permanent: true }));
  },
};

export default nextConfig;
