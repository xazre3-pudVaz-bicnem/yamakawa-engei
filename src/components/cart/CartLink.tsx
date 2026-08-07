"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

/**
 * ヘッダーのカートリンク
 *
 * 件数は localStorage を読み終えてから表示する。
 * サーバー描画時とクライアント描画時で数が食い違うのを避けるため。
 */
export default function CartLink({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { totalQuantity, isReady } = useCart();
  const count = isReady ? totalQuantity : 0;

  return (
    <Link
      href="/cart"
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center transition-colors",
        tone === "dark"
          ? "text-cream hover:text-lychee-soft"
          : "text-forest hover:text-lychee-deep",
        className,
      )}
      aria-label={
        count > 0 ? `カート（${count}点の商品）` : "カート（商品は入っていません）"
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[1.35rem] w-[1.35rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16l-1.6 10.5a2 2 0 0 1-2 1.7H7.6a2 2 0 0 1-2-1.7L4 6Z" />
        <path d="M9 6a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="tnum absolute right-0 top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-lychee px-1 text-[0.65rem] leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
