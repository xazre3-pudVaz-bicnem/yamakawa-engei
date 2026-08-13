"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import QuantityStepper from "./QuantityStepper";
import Photo from "@/components/ui/Photo";
import { SHIPPING, isShippingConfigured } from "@/data/shipping";
import { formatPrice } from "@/lib/utils";

/**
 * カートの中身
 *
 * 送料はご購入手続きの画面（Stripe）でお届け先に応じて加算される。
 * ここでは商品の小計までを見せ、架空の送料を足さない。
 */
export default function CartContents() {
  const { lines, subtotal, isReady, setQuantity, remove, totalQuantity } =
    useCart();

  // localStorage の読み込みが終わるまでは、空と誤解される表示を出さない
  if (!isReady) {
    return (
      <p className="py-16 text-center text-[0.9rem] text-moss">
        カートを読み込んでいます…
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-ink/12 bg-paper-warm px-6 py-16 text-center">
        <p className="font-mincho text-[1.1rem] text-forest">
          カートに商品が入っていません
        </p>
        <p className="mx-auto mt-4 max-w-[30rem] text-[0.9rem] leading-[2] text-moss">
          指宿・山川で育ったライチは、旬のあいだだけのお取り扱いです。
          販売の状況はオンラインショップでご確認ください。
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-sm tracking-[0.1em] text-paper transition-colors hover:bg-forest-deep"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  const shippingKnown = isShippingConfigured;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16">
      {/* ---- 商品リスト ---- */}
      <div>
        <ul className="border-t border-ink/12">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li
              key={product.slug}
              className="flex gap-4 border-b border-ink/12 py-6 md:gap-6"
            >
              <Link
                href={`/products/${product.slug}`}
                className="w-24 shrink-0 md:w-32"
              >
                <Photo
                  src={product.images[0]?.src ?? null}
                  alt={product.images[0]?.alt ?? product.name}
                  slot={product.images[0]?.slot}
                  aspect="aspect-square"
                  sizes="128px"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-3">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-mincho text-[1.02rem] leading-snug text-forest underline-offset-4 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-[0.8rem] text-moss">
                    {[product.volume, product.countGuide]
                      .filter(Boolean)
                      .join("／")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <QuantityStepper
                    value={quantity}
                    max={product.maxQuantity}
                    onChange={(next) => setQuantity(product.slug, next)}
                    label={`${product.shortName} の数量`}
                    size="sm"
                  />
                  <p className="tnum font-mincho text-[1.05rem] text-ink">
                    {formatPrice(lineTotal) ?? "価格は準備中"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="self-start text-[0.8rem] text-moss underline underline-offset-4 transition-colors hover:text-lychee-deep"
                >
                  削除する
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href="/shop"
            className="text-[0.85rem] text-moss underline underline-offset-4 hover:text-forest"
          >
            買い物を続ける
          </Link>
        </div>
      </div>

      {/* ---- お会計 ---- */}
      <aside className="border border-ink/12 bg-paper-warm px-6 py-7 lg:sticky lg:top-28">
        <h2 className="font-mincho text-[1.1rem] text-forest">お会計</h2>

        <dl className="mt-6 space-y-3 text-[0.9rem]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">商品点数</dt>
            <dd className="tnum">{totalQuantity}点</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">小計（税込）</dt>
            <dd className="tnum font-mincho text-[1.15rem] text-ink">
              {formatPrice(subtotal) ?? "—"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">送料</dt>
            <dd className="text-right text-[0.85rem]">
              {shippingKnown && SHIPPING.mode === "flat"
                ? (formatPrice(SHIPPING.flatFee) ?? "別途")
                : shippingKnown && SHIPPING.mode === "free"
                  ? "無料"
                  : "別途"}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-ink/12 pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[0.9rem] text-moss">商品の小計</span>
            <span className="tnum font-mincho text-[1.35rem] text-forest">
              {formatPrice(subtotal) ?? "—"}
            </span>
          </div>
          {/* 送料は次の画面（Stripe）でお届け先に応じて確定するため、
              ここで架空の合計を出さない */}
          <p className="mt-3 text-[0.78rem] leading-[1.85] text-moss">
            送料を含めた合計金額は、次のご購入手続きの画面でご確認いただけます。
            {SHIPPING.carrier}でお届けします。
          </p>
        </div>

        <Link
          href="/checkout"
          className="mt-7 flex w-full items-center justify-center border border-lychee bg-lychee px-6 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
        >
          ご購入手続きへ進む
        </Link>

        <p className="mt-4 text-[0.75rem] leading-[1.85] text-moss">
          <Link href="/shipping" className="underline underline-offset-4">
            配送・送料について
          </Link>
          ／
          <Link href="/legal" className="underline underline-offset-4">
            特定商取引法に基づく表記
          </Link>
        </p>
      </aside>
    </div>
  );
}
