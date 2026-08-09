import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import ShopCta from "./ShopCta";
import {
  getRelatedGuidePages,
  guideCrumbs,
  guidePath,
  type GuidePage,
} from "@/data/lycheeGuide";
import { siteConfig } from "@/data/siteConfig";
import { guideArticleJsonLd } from "@/lib/jsonld";
import { formatDate } from "@/lib/utils";

/**
 * ライチ完全ガイドの共通レイアウト
 *
 * 各ページは本文（children）だけを書けばよく、
 * パンくず・Article構造化データ・更新日・運営者表示・関連ページ・
 * 商品への導線は、すべてここが受け持つ。
 *
 * こうしておくと、ページを足したときに
 * 構造化データや内部リンクの実装漏れが起きない。
 */
export default function GuideLayout({
  page,
  children,
  /** 本文の下・関連ページの上に置く農園からの一次情報 */
  farmNote,
  /** 商品への導線を出すか（ギフトなど文脈に合わない場合だけ false） */
  showShopCta = true,
}: {
  page: GuidePage;
  children: React.ReactNode;
  farmNote?: React.ReactNode;
  showShopCta?: boolean;
}) {
  const related = getRelatedGuidePages(page);
  const path = guidePath(page.slug);

  return (
    <>
      <JsonLd data={guideArticleJsonLd(page)} />

      {/* ================= ヘッダー ================= */}
      <header className="relative isolate overflow-hidden bg-forest-deep">
        {page.hero.src ? (
          <>
            <Image
              src={page.hero.src}
              alt={page.hero.alt}
              fill
              sizes="100vw"
              priority
              quality={82}
              className="object-cover opacity-45"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-forest-deep/90 via-forest-deep/55 to-forest-deep/65"
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="grain absolute inset-0 bg-linear-to-br from-forest via-forest-deep to-forest-deep"
          />
        )}

        <div className="relative mx-auto w-full max-w-4xl px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-36">
          <Breadcrumbs items={guideCrumbs(page)} tone="dark" />

          <h1 className="mt-7 max-w-[26ch] font-mincho text-[1.6rem] leading-[1.5] tracking-[0.03em] text-cream md:text-[2.3rem]">
            {page.h1}
          </h1>

          <p className="mt-6 max-w-[40rem] text-[0.95rem] leading-[2.05] text-cream/85">
            {page.lead}
          </p>

          {/* 運営者と更新日（E-E-A-T）。
              確認が取れていない記事を、生産者本人が書いたようには見せない。 */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream/15 pt-6 text-[0.78rem] text-cream/70">
            <span>
              発信：
              <Link
                href="/about"
                className="ml-1 underline underline-offset-4 hover:text-cream"
              >
                {siteConfig.name}
              </Link>
              （{siteConfig.address.full}）
            </span>
            <span className="tnum">
              <time dateTime={page.updatedAt}>
                {formatDate(page.updatedAt)}
              </time>
              更新
            </span>
            {page.reviewedAt && (
              <span className="inline-flex items-center border border-lychee-soft/45 px-2.5 py-0.5 text-[0.72rem] text-lychee-soft">
                山川園芸確認済み（{formatDate(page.reviewedAt)}）
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ================= 本文 ================= */}
      <article className="mx-auto w-full max-w-4xl px-5 py-16 md:px-8 md:py-20">
        {children}
      </article>

      {/* ================= 農園からの一次情報 ================= */}
      {farmNote && (
        <div className="mx-auto w-full max-w-4xl px-5 pb-16 md:px-8 md:pb-20">
          <Reveal>{farmNote}</Reveal>
        </div>
      )}

      {/* ================= 商品への導線 ================= */}
      {showShopCta && (
        <div className="mx-auto w-full max-w-4xl px-5 pb-16 md:px-8 md:pb-20">
          <Reveal>
            <ShopCta location={path} />
          </Reveal>
        </div>
      )}

      {/* ================= 関連ページ ================= */}
      {related.length > 0 && (
        <section className="bg-paper-warm">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 md:px-8 md:py-20">
            <Reveal>
              <h2 className="font-mincho text-[1.25rem] leading-snug text-forest md:text-[1.45rem]">
                あわせて読みたい
              </h2>
              <span
                aria-hidden="true"
                className="reveal-line mt-6 block h-px w-14 bg-leaf/60"
              />
            </Reveal>

            <Reveal className="mt-9">
              <ul className="divide-y divide-ink/12 border-y border-ink/12">
                {related.map((item) => (
                  <li key={item.slug || "root"}>
                    <Link
                      href={guidePath(item.slug)}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <span>
                        <span className="font-mincho text-[1.02rem] text-forest underline-offset-8 group-hover:underline">
                          {item.navLabel}
                        </span>
                        <span className="mt-1.5 block text-[0.85rem] leading-[1.85] text-moss">
                          {item.navDescription}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-lychee-deep"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-9">
              <Link
                href="/lychee"
                className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                ライチ完全ガイドの目次へ戻る
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
