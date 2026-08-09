"use client";

import Link from "next/link";
import Photo from "@/components/ui/Photo";
import {
  currentSales,
  salesStatus,
  siteConfig,
} from "@/data/siteConfig";
import { isBuyable, visibleProducts } from "@/data/products";
import { trackShopCta } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

/**
 * 解説ページから商品への導線
 *
 * ─────────────────────────────────────────────
 * 設計方針
 * ─────────────────────────────────────────────
 * ・販売状況（siteConfig の salesStatus.phase）と商品データに連動する。
 *   販売中なら「商品を見る」、予約中なら「予約商品を見る」、
 *   終了していれば「次回販売のお知らせ」に文言が変わる。
 * ・記事の途中や末尾に1つだけ置く。本文を広告だらけにしない。
 * ・どの記事から購入導線に入ったかを計測できるよう、
 *   クリック時に location（記事のパス）を送っている。
 */
export default function ShopCta({
  /** 設置している記事のパス。計測に使う */
  location,
  /** 見出しを変えたいときだけ渡す */
  heading,
}: {
  location: string;
  heading?: string;
}) {
  const buyable = visibleProducts.filter(isBuyable);
  const onSale = buyable.length > 0;

  /** 販売していないときの文言 */
  const closedCopy =
    salesStatus.phase === "closed"
      ? {
          title: "今季の販売は終了しました",
          body: "たくさんのご注文をありがとうございました。次の収穫は来年の初夏です。再開のお知らせは公式Instagramと本サイトでお伝えします。",
          label: "次回販売のお知らせを見る",
          href: "/news",
        }
      : {
          title: "販売の準備をしています",
          body: `山川園芸のライチをお届けできるのは${salesStatus.seasonLabel}まで。販売の開始は公式Instagramと本サイトでお知らせします。`,
          label: "商品を見る",
          href: "/shop",
        };

  return (
    <aside className="grain overflow-hidden border border-ink/12 bg-paper-warm">
      <div className="grid gap-0 md:grid-cols-[1fr_1.25fr]">
        <Photo
          src="/images/products/lychee-tray.jpg"
          alt="鹿児島県指宿市の山川園芸が産地直送でお届けする生ライチ"
          aspect="aspect-[4/3] md:aspect-auto md:h-full"
          sizes="(min-width: 768px) 40vw, 100vw"
        />

        <div className="px-6 py-8 md:px-9 md:py-10">
          <p className="font-serif-en text-[0.66rem] uppercase tracking-[0.28em] text-lychee-deep">
            Online shop
          </p>
          <h2 className="mt-3 font-mincho text-[1.25rem] leading-[1.6] text-forest md:text-[1.4rem]">
            {heading ?? "山川園芸の生ライチ"}
          </h2>

          {onSale ? (
            <>
              <p className="mt-4 text-[0.92rem] leading-[2] text-ink/85">
                {siteConfig.address.full}の農園から、旬のあいだだけ産地直送でお届けしています。
                お届けできるのは{salesStatus.seasonLabel}までです。
              </p>

              <ul className="mt-6 space-y-2 border-t border-ink/12 pt-5 text-[0.88rem]">
                {buyable.map((product) => (
                  <li key={product.slug} className="flex justify-between gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => trackShopCta(location, product.name)}
                      className="text-forest underline-offset-4 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <span className="tnum shrink-0 text-moss">
                      {formatPrice(product.price)}
                      <span className="ml-1 text-[0.75rem]">税込</span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/shop"
                onClick={() => trackShopCta(location, currentSales.ctaLabel)}
                className="mt-7 inline-flex items-center justify-center border border-lychee bg-lychee px-8 py-3.5 text-[0.9rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
              >
                {currentSales.ctaLabel}
              </Link>
            </>
          ) : (
            <>
              <p className="mt-4 font-mincho text-[1.02rem] text-forest">
                {closedCopy.title}
              </p>
              <p className="mt-3 text-[0.92rem] leading-[2] text-ink/85">
                {closedCopy.body}
              </p>
              <Link
                href={closedCopy.href}
                onClick={() => trackShopCta(location, closedCopy.label)}
                className="mt-7 inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
              >
                {closedCopy.label}
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
