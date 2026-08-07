import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { currentSales, salesStatus, siteConfig } from "@/data/siteConfig";
import { getLatestNews, newsCategoryLabel } from "@/data/news";
import { formatDateDot } from "@/lib/utils";

/**
 * 今年のライチ販売状況
 *
 * 文言は data/siteConfig.ts の salesStatus.phase を書き換えるだけで変わる。
 *   "on_sale"（販売中）／"preorder"（予約受付中）
 *   ／"coming_soon"（近日販売開始）／"closed"（今季販売終了）
 */
export default function SalesStatusSection() {
  const latestNews = getLatestNews(2);

  return (
    <section
      aria-labelledby="sales-status-heading"
      className="border-b border-ink/10 bg-paper-warm"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center border border-lychee/40 bg-lychee-soft/45 px-3.5 py-1 text-[0.72rem] tracking-[0.14em] text-lychee-deep">
                {currentSales.label}
              </span>
              <span className="text-[0.78rem] tracking-[0.06em] text-moss">
                {salesStatus.saleStartDate
                  ? `${formatDateDot(salesStatus.saleStartDate)} 開始`
                  : `旬は${salesStatus.seasonLabel}`}
              </span>
            </div>

            <h2
              id="sales-status-heading"
              className="mt-6 font-mincho text-[1.5rem] leading-[1.55] text-forest md:text-[1.9rem]"
            >
              {currentSales.heading}
            </h2>

            <p className="mt-5 max-w-[40rem] text-[0.93rem] leading-[2.05] text-ink/80">
              {currentSales.body}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={currentSales.ctaHref}
              className="inline-flex items-center justify-center border border-lychee bg-lychee px-8 py-3.5 text-[0.9rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
            >
              {currentSales.ctaLabel}
            </Link>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
            >
              最新の様子を見る
            </a>
          </div>
        </Reveal>

        {latestNews.length > 0 && (
          <Reveal className="mt-12 border-t border-ink/12 pt-8">
            <ul className="space-y-4">
              {latestNews.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5"
                >
                  <time
                    dateTime={item.date}
                    className="tnum shrink-0 font-serif-en text-[0.78rem] tracking-[0.1em] text-moss"
                  >
                    {formatDateDot(item.date)}
                  </time>
                  <span className="shrink-0 text-[0.72rem] tracking-[0.1em] text-lychee-deep">
                    {newsCategoryLabel[item.category]}
                  </span>
                  <span className="text-[0.9rem] leading-relaxed">
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        className="underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link
                href="/news"
                className="text-[0.83rem] text-moss underline underline-offset-4 hover:text-forest"
              >
                お知らせ一覧
              </Link>
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
