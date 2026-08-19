"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import QuantityStepper from "./QuantityStepper";
import Photo from "@/components/ui/Photo";
import { SHIPPING, isShippingConfigured, planParcels } from "@/data/shipping";
import { availabilityLabel, isBuyable } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * カートの中身
 *
 * 送料はご購入手続きの画面（Stripe）でお届け先に応じて加算される。
 * ここでは商品の小計までを見せ、架空の送料を足さない。
 *
 * 個口数はお届け先に関係なく決まるので、ここでもお知らせする。
 * ただしこの計算は表示のためだけのもので、
 * 請求される送料はサーバー側で計算し直した値になる。
 *
 * ─────────────────────────────────────────────
 * 売り切れ・販売終了になった商品
 * ─────────────────────────────────────────────
 * カートの中身はブラウザに残るため、販売終了後に戻ってきたお客様の
 * カートには買えない商品が入っていることがある。
 * その状態で購入手続きへ進ませると、決済画面まで行ってから
 * 断られることになるので、ここで止めて理由を伝える。
 * （サーバー側でも lib/order.ts が同じ商品を弾いている）
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

  // 売り切れ・販売終了になった商品がカートに残っていないか
  const unavailableLines = lines.filter(({ product }) => !isBuyable(product));
  const hasUnavailable = unavailableLines.length > 0;

  // 表示専用。請求額はサーバー側で計算し直す
  const plan = planParcels(
    lines.map(({ product, quantity }) => ({
      name: product.name,
      weightGrams: product.weightGrams,
      quantity,
    })),
  );

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
                  {isBuyable(product) ? (
                    <QuantityStepper
                      value={quantity}
                      max={product.maxQuantity}
                      onChange={(next) => setQuantity(product.slug, next)}
                      label={`${product.shortName} の数量`}
                      size="sm"
                    />
                  ) : (
                    // 買えない商品の数量は変えられないようにし、状態を明示する
                    <span className="inline-flex items-center border border-lychee/40 bg-lychee-soft/30 px-3 py-1.5 text-[0.78rem] text-lychee-deep">
                      {availabilityLabel[product.availability]}
                      <span className="ml-2 text-moss">×{quantity}</span>
                    </span>
                  )}
                  <p
                    className={`tnum font-mincho text-[1.05rem] ${
                      isBuyable(product) ? "text-ink" : "text-moss line-through"
                    }`}
                  >
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
          {/* 買えない商品が入っているあいだは、個口数・送料を出さない
              （発送されない前提の数字を見せない） */}
          {!hasUnavailable && plan.ok ? (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-moss">個口数</dt>
              <dd className="tnum">{plan.parcels}個口</dd>
            </div>
          ) : null}
          {hasUnavailable ? null : (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-moss">送料</dt>
              <dd className="text-right text-[0.85rem]">
                {shippingKnown ? "お届け先により変動" : "別途"}
              </dd>
            </div>
          )}
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
          {hasUnavailable ? null : (
            <>
              <p className="mt-3 text-[0.78rem] leading-[1.85] text-moss">
                送料は次のご購入手続きの画面で、お届け先を入力すると自動で計算されます。
                {SHIPPING.carrier}でお送りします。
                {plan.ok
                  ? `ご注文の内容は${plan.parcels}個口となり、${plan.parcels}個口分の送料がかかります。`
                  : "1個口にまとめられる分はまとめてお送りします。"}
              </p>
              <p className="mt-2">
                <Link
                  href="/shipping"
                  className="text-[0.78rem] text-lychee-deep underline underline-offset-4 hover:text-lychee"
                >
                  地域別の送料を見る
                </Link>
              </p>
            </>
          )}
        </div>

        {hasUnavailable ? (
          /* 買えない商品が入っているあいだは、購入手続きへ進ませない。
             決済画面まで進んでから断るより、ここで理由をお伝えする。 */
          <div className="mt-7 border border-lychee/40 bg-lychee-soft/30 px-5 py-5">
            <p className="text-[0.88rem] leading-[1.9] text-lychee-deep">
              {unavailableLines.length === lines.length
                ? "カートの商品は、ただいまご購入いただけません。"
                : "ご購入いただけない商品がカートに入っています。"}
            </p>
            <ul className="mt-3 space-y-1 text-[0.82rem] leading-[1.8] text-ink/80">
              {unavailableLines.map(({ product }) => (
                <li key={product.slug}>
                  {product.name}（{availabilityLabel[product.availability]}）
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.82rem] leading-[1.9] text-moss">
              お手数ですが、カートから削除してください。
              次の収穫は来年の初夏です。再開は公式Instagramとお知らせでご案内します。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  unavailableLines.forEach(({ product }) => remove(product.slug))
                }
                className="inline-flex items-center justify-center border border-forest bg-forest px-6 py-3 text-[0.85rem] tracking-[0.08em] text-paper transition-colors hover:bg-forest-deep"
              >
                買えない商品を削除する
              </button>
              <Link
                href="/lychee"
                className="inline-flex items-center justify-center border border-ink/20 px-6 py-3 text-[0.85rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
              >
                ライチについて知る
              </Link>
            </div>
          </div>
        ) : (
          <Link
            href="/checkout"
            className="mt-7 flex w-full items-center justify-center border border-lychee bg-lychee px-6 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
          >
            ご購入手続きへ進む
          </Link>
        )}

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
