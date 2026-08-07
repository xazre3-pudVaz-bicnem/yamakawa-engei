"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import CartLink from "@/components/cart/CartLink";
import {
  currentSales,
  isPurchasable,
  navigation,
  siteConfig,
} from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/**
 * ヘッダー
 *
 * TOPページではヒーロー写真の上に重ねるため、最上部では背景を透過させる。
 * スクロールすると下地が入り、文字が写真に埋もれないようにする。
 */
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ページ遷移でメニューを閉じる。
  // useEffect ではなくレンダー中に状態を調整する（Reactが推奨する形）。
  // 直前に描画したパスを覚えておき、変わっていたらメニューを閉じる。
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // メニューを開いているあいだは背面をスクロールさせない
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Escキーで閉じる
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const overlay = isHome && !scrolled && !menuOpen;
  const tone = overlay ? "dark" : "light";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          overlay
            ? "bg-transparent"
            : "border-b border-ink/10 bg-paper/95 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          <Link href="/" aria-label="山川園芸 ホーム">
            <Logo tone={tone} />
          </Link>

          {/* ---- PC ---- */}
          <nav aria-label="メインメニュー" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-[0.82rem] tracking-[0.08em] transition-colors",
                      overlay
                        ? "text-cream/90 hover:text-cream"
                        : "text-ink/80 hover:text-forest",
                      pathname.startsWith(item.href) &&
                        !overlay &&
                        "text-forest",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <CartLink tone={tone} />

            {/* 販売中・予約中のときだけ購入ボタンを出す */}
            {isPurchasable && (
              <Link
                href="/shop"
                className="hidden border border-lychee bg-lychee px-6 py-2.5 text-[0.8rem] tracking-[0.08em] text-white transition-colors hover:border-lychee-deep hover:bg-lychee-deep lg:inline-flex"
              >
                {currentSales.ctaLabel}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "flex h-11 w-11 items-center justify-center lg:hidden",
                overlay ? "text-cream" : "text-forest",
              )}
            >
              <span className="sr-only">
                {menuOpen ? "メニューを閉じる" : "メニューを開く"}
              </span>
              <span aria-hidden="true" className="relative block h-3.5 w-6">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-300",
                    menuOpen ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-transform duration-300",
                    menuOpen ? "top-1/2 -rotate-45" : "top-full",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- スマホ・タブレットのメニュー ---- */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 overflow-y-auto bg-forest-deep px-5 pb-16 pt-[5.5rem] lg:hidden"
      >
        <nav aria-label="メインメニュー（モバイル）">
          <ul className="divide-y divide-cream/12 border-y border-cream/12">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between gap-4 py-5 text-cream"
                >
                  <span className="font-mincho text-[1.05rem] tracking-[0.06em]">
                    {item.label}
                  </span>
                  <span className="font-serif-en text-[0.62rem] uppercase tracking-[0.24em] text-cream/45">
                    {item.labelEn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.85rem] text-cream/75">
          {[
            { href: "/faq", label: "よくある質問" },
            { href: "/guide", label: "お買い物ガイド" },
            { href: "/shipping", label: "配送・送料" },
            { href: "/column", label: "コラム" },
            { href: "/news", label: "お知らせ" },
            { href: "/contact", label: "お問い合わせ" },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block py-1.5">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/shop"
          className="mt-10 flex w-full items-center justify-center border border-lychee bg-lychee px-8 py-4 text-[0.95rem] tracking-[0.1em] text-white"
        >
          {currentSales.ctaLabel}
        </Link>

        <div className="mt-8 space-y-2 text-[0.82rem] leading-[1.9] text-cream/60">
          <p>{siteConfig.address.full}</p>
          <p>
            <a href={siteConfig.phoneHref} className="underline underline-offset-4">
              {siteConfig.phone}
            </a>
            （{siteConfig.hoursSummary}）
          </p>
          <p>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Instagram {siteConfig.instagram.handle}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
