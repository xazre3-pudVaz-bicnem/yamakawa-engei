import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { columnCategoryLabel, sortedColumns } from "@/data/column";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

/**
 * コラム一覧（/column）
 *
 * data/column.ts に記事を追加すれば、この一覧・記事ページ・
 * sitemap.xml のすべてに自動で反映される。
 */

/**
 * ライチそのものの解説は /lychee のガイドが担当する。
 * ここは「農園の記録」を載せる場所。
 * 記事が0件のあいだは noindex にして、
 * 中身のないページを検索結果に出さないようにしている（sitemapにも載せない）。
 */
const baseMetadata = buildMetadata({
  title: "農園のコラム｜山川園芸の記録",
  description:
    "鹿児島県指宿市山川のライチ農園、山川園芸の記録です。収穫の様子や、その年の実りについてお伝えします。",
  path: "/column",
});

export const metadata =
  sortedColumns.length > 0
    ? baseMetadata
    : { ...baseMetadata, robots: { index: false, follow: true } };

export default function ColumnPage() {
  return (
    <>
      <PageHero
        eyebrow="Column"
        title="農園の記録"
        lead="収穫の様子や、その年の実りのこと。指宿の農園から少しずつ書きためています。"
        crumbs={[{ name: "農園のコラム", path: "/column" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {sortedColumns.length === 0 ? (
          <div>
            <p className="text-[0.93rem] leading-[2] text-moss">
              現在、掲載している記事はありません。
              農園の日々の様子は公式Instagramでご覧いただけます。
            </p>
            <p className="mt-7 text-[0.9rem] leading-[2] text-ink/80">
              ライチという果物についての解説は、
              <Link
                href="/lychee"
                className="mx-1 text-lychee-deep underline underline-offset-4 hover:text-lychee"
              >
                ライチ完全ガイド
              </Link>
              にまとめています。旬・栄養・食べ方・保存方法などをご覧いただけます。
            </p>
          </div>
        ) : (
          <ul className="border-t border-ink/12">
            {sortedColumns.map((article) => (
              <Reveal
                as="li"
                key={article.slug}
                className="border-b border-ink/12"
              >
                <Link href={`/column/${article.slug}`} className="group block py-9">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <time
                      dateTime={article.date}
                      className="tnum font-serif-en text-[0.78rem] tracking-[0.1em] text-moss"
                    >
                      {formatDate(article.date)}
                    </time>
                    <span className="border border-leaf/40 px-2.5 py-0.5 text-[0.7rem] tracking-[0.1em] text-forest">
                      {columnCategoryLabel[article.category]}
                    </span>
                  </div>

                  <h2 className="mt-4 font-mincho text-[1.2rem] leading-[1.65] text-forest underline-offset-8 group-hover:underline md:text-[1.35rem]">
                    {article.title}
                  </h2>

                  <p className="mt-3 max-w-[44rem] text-[0.9rem] leading-[1.95] text-moss">
                    {article.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
