"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { hasStock, useStock } from "./useStock";
import QuantityStepper from "./QuantityStepper";
import { availabilityLabel, isBuyable, type Product } from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { track } from "@/lib/analytics";

/**
 * 数量選択＋カートに入れる
 *
 * 売り切れ・販売準備中の商品はカートに入れられない。
 * 価格が未確定の商品も同様（金額の分からないものは買わせない）。
 *
 * 残りの数を数えている商品（products.ts の stock）は、
 * /api/stock で残りを確認してから数量の上限を決める。
 * 数を確認できなかったときは、カートに入れさせない。
 */
export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const buyable = isBuyable(product);
  const counted = product.stock !== null;
  const stock = useStock(product.slug, buyable && counted);

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

  /* ---- 残りの数を数えている商品 ---- */
  if (counted) {
    if (stock === "loading") {
      return (
        <div
          aria-live="polite"
          className="border border-ink/12 bg-paper-warm px-6 py-6 text-[0.9rem] text-moss"
        >
          ご用意できる数を確認しています…
        </div>
      );
    }

    // 数が分からないときは、売り切れと同じ扱いにする
    if (stock === "unknown") {
      return (
        <div className="border border-ink/12 bg-paper-warm px-6 py-6">
          <p className="font-mincho text-[1.05rem] text-forest">
            ご用意できる数を確認できませんでした
          </p>
          <p className="mt-3 text-[0.88rem] leading-[1.95] text-moss">
            お手数ですが、時間をおいてページを開き直してください。
            お急ぎの場合は、お電話またはお問い合わせよりご連絡ください。
          </p>
          <div className="mt-5 text-[0.85rem]">
            <Link
              href="/contact"
              className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      );
    }

    if (stock.remaining <= 0) {
      return (
        <div className="border border-ink/12 bg-paper-warm px-6 py-6">
          <p className="font-mincho text-[1.05rem] text-forest">
            ただいま売り切れです
          </p>
          {/* 農園が「次のご用意の目安」を書いていれば、それを先に出す */}
          {stock.note ? (
            <p className="mt-3 text-[0.88rem] leading-[1.95] text-forest">
              {stock.note}
            </p>
          ) : null}
          <p className="mt-3 text-[0.88rem] leading-[1.95] text-moss">
            {product.shortName}
            は、収穫と出荷の準備ができしだい、またご用意します。
            次のご用意は公式Instagramとお知らせでご案内します。
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
              次のご用意について問い合わせる
            </Link>
          </div>
        </div>
      );
    }
  }

  // 数量の上限。残りの数を数えている商品は、残りを超えて選べない
  const limit = hasStock(stock)
    ? Math.max(1, Math.min(product.maxQuantity, stock.remaining))
    : product.maxQuantity;

  return (
    <div>
      {hasStock(stock) ? (
        <p className="mb-4 text-[0.88rem] leading-[1.9] text-forest">
          ただいまご用意できるのは{stock.remaining}点です。
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={Math.min(quantity, limit)}
          max={limit}
          onChange={setQuantity}
          label={`${product.shortName} の数量`}
        />
        <p className="text-[0.8rem] text-moss">
          1回のご注文で最大{limit}点まで
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          add(product.slug, Math.min(quantity, limit));
          setAdded(true);
          // GA4（タグ未設置のあいだは何も起きない）
          track("add_to_cart", {
            currency: "JPY",
            value: (product.price ?? 0) * Math.min(quantity, limit),
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                price: product.price ?? undefined,
                quantity: Math.min(quantity, limit),
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
