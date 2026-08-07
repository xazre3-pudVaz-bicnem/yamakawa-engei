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

export const metadata = buildMetadata({
  title: "コラム｜ライチと農園のはなし",
  description:
    "ライチの旬、贈り物としてのライチ、指宿で南国のフルーツが育つ理由。山川園芸がお届けする読みものです。",
  path: "/column",
  keywords: ["ライチ 旬", "ライチ ギフト", "指宿 フルーツ", "熱帯果樹"],
});

export default function ColumnPage() {
  return (
    <>
      <PageHero
        eyebrow="Column"
        title="ライチと農園のはなし"
        lead="旬のこと、贈り物のこと、指宿という土地のこと。少しずつ書きためています。"
        crumbs={[{ name: "コラム", path: "/column" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {sortedColumns.length === 0 ? (
          <p className="text-[0.93rem] text-moss">
            現在、掲載している記事はありません。
          </p>
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
