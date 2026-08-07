import type { Metadata } from "next";
import Hero from "@/components/sections/home/Hero";
import SalesStatusSection from "@/components/sections/home/SalesStatusSection";
import LycheeIntroSection from "@/components/sections/home/LycheeIntroSection";
import OurLycheeSection from "@/components/sections/home/OurLycheeSection";
import ProductsSection from "@/components/sections/home/ProductsSection";
import FirstTimeSection from "@/components/sections/home/FirstTimeSection";
import EnjoySection from "@/components/sections/home/EnjoySection";
import GiftSection from "@/components/sections/home/GiftSection";
import StorySection from "@/components/sections/home/StorySection";
import InstagramSection from "@/components/sections/home/InstagramSection";
import FaqSection from "@/components/sections/home/FaqSection";
import AccessSection from "@/components/sections/home/AccessSection";
import JsonLd from "@/components/ui/JsonLd";
import { productListJsonLd } from "@/lib/jsonld";
import { isPublicSite } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "国産の生ライチ通販｜鹿児島・指宿の山川園芸",
  description:
    "鹿児島県指宿市山川の農園から、旬の生ライチを産地直送。国産ライチの旬は6月下旬から7月ごろのごく短い期間です。食べ方・保存方法もご案内しています。",
  ...(isPublicSite
    ? { alternates: { canonical: "/" } }
    : { robots: { index: false, follow: false } }),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={productListJsonLd()} />

      {/* 1. ヒーロー */}
      <Hero />

      {/* 2. 今年のライチ販売状況 */}
      <SalesStatusSection />

      {/* 3. 生のライチ、食べたことありますか？ */}
      <LycheeIntroSection />

      {/* 4. 山川園芸のライチ */}
      <OurLycheeSection />

      {/* 5. 商品一覧 */}
      <ProductsSection />

      {/* 6. 初めてライチを食べる方へ */}
      <FirstTimeSection />

      {/* 7. 楽しみ方 */}
      <EnjoySection />

      {/* 8. 贈り物としてのライチ */}
      <GiftSection />

      {/* 9. 山川園芸について */}
      <StorySection />

      {/* 10. 農園の日々（Instagram） */}
      <InstagramSection />

      {/* 11. よくある質問 */}
      <FaqSection />

      {/* 12. アクセス・農園情報 */}
      <AccessSection />

      {/* 13. フッターは app/layout.tsx で全ページ共通 */}
    </>
  );
}
