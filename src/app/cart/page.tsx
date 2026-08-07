import type { Metadata } from "next";
import CartContents from "@/components/cart/CartContents";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "カート",
  description: "カートに入れた商品をご確認いただけます。",
  // カートは検索結果に出す意味がないためインデックスしない。
  // canonical / og:url を明示しないとルートレイアウトの "/" を引き継いでしまうため、
  // 自分自身のパスで上書きする。
  alternates: { canonical: "/cart" },
  openGraph: { url: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
      <Breadcrumbs items={[{ name: "カート", path: "/cart" }]} />

      <h1 className="mt-8 font-mincho text-[1.7rem] leading-snug text-forest md:text-[2.2rem]">
        カート
      </h1>
      <span
        aria-hidden="true"
        className="mt-7 block h-px w-16 bg-leaf/60"
      />

      <div className="mt-12 md:mt-16">
        <CartContents />
      </div>
    </div>
  );
}
