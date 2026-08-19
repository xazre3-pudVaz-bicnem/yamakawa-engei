"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { currentSales, salesStatus } from "@/data/siteConfig";
import { isBuyable } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * スマホ用の下部固定バー
 *
 * 購入までの距離を縮めるための導線。
 * 「残り○個」のような、実データにない煽り表示はしない。
 * カート・購入手続きの画面では、操作の邪魔になるため出さない。
 *
 * 販売終了後にカートが残っているお客様には、購入手続きへの導線を出さない。
 * 進んでも買えないため、カートで状況をお伝えする。
 */
export default function MobileBuyBar() {
  const pathname = usePathname();
  const { lines, totalQuantity, subtotal, isReady } = useCart();

  const hidden =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/");

  if (hidden) return null;

  const hasItems = isReady && totalQuantity > 0;
  /** カートに買えない商品が入っているか */
  const hasUnavailable = lines.some(({ product }) => !isBuyable(product));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/12 bg-paper/97 backdrop-blur-sm lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {hasItems ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] tracking-[0.1em] text-moss">
                カート {totalQuantity}点
              </p>
              <p className="tnum truncate font-mincho text-[1.05rem] text-forest">
                {formatPrice(subtotal) ?? "—"}
                <span className="ml-1 text-[0.7rem] text-moss">
                  {hasUnavailable ? "ご購入いただけません" : "送料別"}
                </span>
              </p>
            </div>
            {hasUnavailable ? (
              // 買えない商品が入っているときは、カートへ戻す導線だけにする
              <Link
                href="/cart"
                className="shrink-0 border border-forest bg-forest px-6 py-3 text-[0.85rem] tracking-[0.06em] text-paper"
              >
                カートを見る
              </Link>
            ) : (
              <>
                <Link
                  href="/cart"
                  className="shrink-0 border border-forest px-4 py-3 text-[0.8rem] tracking-[0.06em] text-forest"
                >
                  カート
                </Link>
                <Link
                  href="/checkout"
                  className="shrink-0 border border-lychee bg-lychee px-5 py-3 text-[0.85rem] tracking-[0.06em] text-white"
                >
                  購入手続き
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] tracking-[0.1em] text-lychee-deep">
                {currentSales.label}
              </p>
              <p className="truncate text-[0.82rem] text-moss">
                旬は{salesStatus.seasonLabel}
              </p>
            </div>
            <Link
              href={currentSales.ctaHref}
              className="shrink-0 border border-lychee bg-lychee px-6 py-3 text-[0.85rem] tracking-[0.06em] text-white"
            >
              {currentSales.ctaLabel}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
