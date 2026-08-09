"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import QuantityStepper from "./QuantityStepper";
import { availabilityLabel, isBuyable, type Product } from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { track } from "@/lib/analytics";

/**
 * 数量選択＋カートに入れる
 *
 * 売り切れ・販売準備中の商品はカートに入れられない。
 * 価格が未確定の商品も同様（金額の分からないものは買わせない）。
 */
export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const buyable = isBuyable(product);

  if (!buyable) {
    return (
      <div className="border border-ink/12 bg-paper-warm px-6 py-6">
        <p className="font-mincho text-[1.05rem] text-forest">
          {product.availability === "sold_out"
            ? "今季分は完売しました"
            : product.price === null
              ? "価格を準備しています"
              : "ただいま販売準備中です"}
        </p>
        <p className="mt-3 text-[0.88rem] leading-[1.95] text-moss">
          {product.availability === "sold_out"
            ? "たくさんのご注文をありがとうございました。次の収穫は来年の初夏です。"
            : "販売の開始は、公式Instagramと本サイトのお知らせでご案内します。"}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem]">
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
          >
            公式Instagramで知らせを受け取る
          </a>
          <Link
            href="/contact"
            className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
          >
            入荷について問い合わせる
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          max={product.maxQuantity}
          onChange={setQuantity}
          label={`${product.shortName} の数量`}
        />
        <p className="text-[0.8rem] text-moss">
          1回のご注文で最大{product.maxQuantity}点まで
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          add(product.slug, quantity);
          setAdded(true);
          // GA4（タグ未設置のあいだは何も起きない）
          track("add_to_cart", {
            currency: "JPY",
            value: (product.price ?? 0) * quantity,
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                price: product.price ?? undefined,
                quantity,
              },
            ],
          });
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 border border-lychee bg-lychee px-8 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
      >
        カートに入れる
      </button>

      {/* 追加したことを読み上げにも伝える */}
      <div aria-live="polite" className="min-h-[2.5rem]">
        {added && (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.85rem] text-forest">
            <span>カートに入れました。</span>
            <Link
              href="/cart"
              className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
            >
              カートを見る
            </Link>
          </p>
        )}
      </div>

      <p className="mt-1 text-[0.78rem] leading-[1.9] text-moss">
        {availabilityLabel[product.availability]}
        {product.priceNote ? `／${product.priceNote}` : ""}
      </p>
    </div>
  );
}
