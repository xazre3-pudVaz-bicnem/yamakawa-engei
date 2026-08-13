import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StripeCheckout from "@/components/cart/StripeCheckout";
import { SHIPPING } from "@/data/shipping";

/**
 * ご購入手続き（/checkout）
 *
 * Stripe Embedded Checkout をこのページ内に描画する。
 * お客様は山川園芸のサイトから出ることなく、
 * 住所とカード情報を入力して決済まで完了できる。
 *
 * 購入手続きの画面は検索結果に出す意味がないため noindex。
 */

export const metadata: Metadata = {
  title: "ご購入手続き",
  description: "ご注文内容をご確認のうえ、お手続きにお進みください。",
  // ルートレイアウトの canonical "/" を引き継がないよう自分自身で上書きする
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

      <p className="mt-7 max-w-[42rem] text-[0.9rem] leading-[2] text-moss">
        お届け先とお支払い情報をご入力ください。
        カード情報は決済代行会社（Stripe）が直接お預かりし、
        山川園芸のサーバーには保存されません。
      </p>

      <div className="mt-12 md:mt-16">
        <StripeCheckout />
      </div>

      <div className="mt-16 border-t border-ink/12 pt-8 text-[0.83rem] leading-[1.95] text-moss">
        <p>
          ご注文の前に
          <Link
            href="/guide"
            className="mx-1 text-lychee-deep underline underline-offset-4"
          >
            お買い物ガイド
          </Link>
          と
          <Link
            href="/legal"
            className="mx-1 text-lychee-deep underline underline-offset-4"
          >
            特定商取引法に基づく表記
          </Link>
          をご確認ください。
        </p>
        <p className="mt-2">{SHIPPING.note}</p>
      </div>
    </div>
  );
}
