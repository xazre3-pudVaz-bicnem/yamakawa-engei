import type { Metadata } from "next";
import CheckoutPanel from "@/components/cart/CheckoutPanel";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "ご購入手続き",
  description: "ご注文内容をご確認のうえ、お手続きにお進みください。",
  // ルートレイアウトの canonical "/" を引き継がないよう、自分自身で上書きする。
  alternates: { canonical: "/checkout" },
  openGraph: { url: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
      <Breadcrumbs
        items={[
          { name: "カート", path: "/cart" },
          { name: "ご購入手続き", path: "/checkout" },
        ]}
      />

      <h1 className="mt-8 font-mincho text-[1.7rem] leading-snug text-forest md:text-[2.2rem]">
        ご購入手続き
      </h1>
      <span aria-hidden="true" className="mt-7 block h-px w-16 bg-leaf/60" />

      <div className="mt-12 md:mt-16">
        <CheckoutPanel />
      </div>
    </div>
  );
}
