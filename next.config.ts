import path from "path";
import type { NextConfig } from "next";

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
};

export default nextConfig;
