import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { newsCategoryLabel, sortedNews } from "@/data/news";
import { currentSales, siteConfig } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

/**
 * お知らせ（/news）
 *
 * 記事は data/news.ts に1件追加するだけで、この一覧とTOPに反映される。
 */

export const metadata = buildMetadata({
  title: "お知らせ",
  description:
    "山川園芸からのお知らせです。今年のライチの販売開始・予約受付・発送についてのご案内を掲載しています。",
  path: "/news",
});

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="お知らせ"
        lead="販売の開始や発送についてのご案内をお届けします。"
        crumbs={[{ name: "お知らせ", path: "/news" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {/* 今の販売状況は常に見えるようにしておく */}
        <Reveal className="border border-ink/12 bg-paper-warm px-6 py-7 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center border border-lychee/40 bg-lychee-soft/45 px-3.5 py-1 text-[0.72rem] tracking-[0.14em] text-lychee-deep">
              {currentSales.label}
            </span>
            <p className="font-mincho text-[1.05rem] text-forest">
              {currentSales.heading}
            </p>
          </div>
          <p className="mt-4 text-[0.9rem] leading-[1.95] text-ink/80">
            {currentSales.body}
          </p>
          <Link
            href={currentSales.ctaHref}
            className="mt-6 inline-flex items-center justify-center border border-forest bg-forest px-7 py-3 text-[0.88rem] tracking-[0.08em] text-paper transition-colors hover:bg-forest-deep"
          >
            {currentSales.ctaLabel}
          </Link>
        </Reveal>

        {sortedNews.length === 0 ? (
          <Reveal className="mt-14">
            <p className="text-[0.93rem] leading-[2.05] text-moss">
              現在、掲載しているお知らせはありません。
              収穫の様子や販売の開始は、まず公式Instagramでお伝えしています。
            </p>
            <p className="mt-6">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                公式Instagram {siteConfig.instagram.handle}
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </p>
          </Reveal>
        ) : (
          <ul className="mt-14 border-t border-ink/12">
            {sortedNews.map((item) => (
              <Reveal as="li" key={item.id} className="border-b border-ink/12 py-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <time
                    dateTime={item.date}
                    className="tnum font-serif-en text-[0.8rem] tracking-[0.08em] text-moss"
                  >
                    {formatDate(item.date)}
                  </time>
                  <span className="border border-leaf/40 px-2.5 py-0.5 text-[0.7rem] tracking-[0.1em] text-forest">
                    {newsCategoryLabel[item.category]}
                  </span>
                </div>

                <h2 className="mt-4 font-mincho text-[1.15rem] leading-[1.7] text-forest">
                  {item.title}
                </h2>

                {item.body && (
                  <div className="mt-4 space-y-3 text-[0.9rem] leading-[2] text-ink/80">
                    {item.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {item.link && (
                  <p className="mt-5">
                    <Link
                      href={item.link.href}
                      className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                    >
                      {item.link.label}
                    </Link>
                  </p>
                )}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
