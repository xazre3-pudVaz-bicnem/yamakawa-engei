import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  getBlogCategoriesInUse,
  getBlogList,
  hasBlogPosts,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

/**
 * ブログ一覧（/blog）
 *
 * 記事は Claude API + GitHub Actions で毎日1本ずつ自動生成され、
 * content/blog/ に追加されます（scripts/generate-daily-post.ts）。
 *
 * 記事が0件のあいだは noindex にして、中身のないページを
 * 検索結果に出さないようにしています（sitemap にも載せません）。
 */

const baseMetadata = buildMetadata({
  title: "ライチのブログ｜山川園芸",
  description:
    "鹿児島県指宿市山川のライチ農園、山川園芸のブログです。国産の生ライチの買い方・保存・楽しみ方・贈り物のヒントを、農園から少しずつお伝えします。",
  path: "/blog",
  keywords: ["国産ライチ 通販", "鹿児島 ライチ", "指宿 ライチ", "生ライチ"],
});

export const metadata = hasBlogPosts()
  ? baseMetadata
  : { ...baseMetadata, robots: { index: false, follow: true } };

export default function BlogIndexPage() {
  const posts = getBlogList();
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="ライチのブログ"
        lead="買い方、保存のコツ、楽しみ方、贈り物のヒント。指宿の農園から少しずつお伝えします。"
        crumbs={[{ name: "ブログ", path: "/blog" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {posts.length === 0 ? (
          <Reveal>
            <p className="text-[0.93rem] leading-[2] text-moss">
              記事を準備しています。もうしばらくお待ちください。
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
          </Reveal>
        ) : (
          <>
            {/* カテゴリー */}
            {categories.length > 0 && (
              <Reveal>
                <nav aria-label="カテゴリー">
                  <ul className="flex flex-wrap gap-x-6 gap-y-3">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/blog/category/${category.slug}`}
                          className="text-[0.87rem] text-moss underline underline-offset-8 transition-colors hover:text-forest"
                        >
                          {category.name}
                          <span className="tnum ml-1.5 text-[0.78rem]">
                            ({category.count})
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            )}

            <ul className="mt-12 border-t border-ink/12">
              {posts.map((post) => (
                <Reveal as="li" key={post.slug} className="border-b border-ink/12">
                  <Link href={`/blog/${post.slug}`} className="group block py-9">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <time
                        dateTime={post.date}
                        className="tnum font-serif-en text-[0.78rem] tracking-[0.1em] text-moss"
                      >
                        {formatDate(post.date)}
                      </time>
                      <span className="border border-leaf/40 px-2.5 py-0.5 text-[0.7rem] tracking-[0.1em] text-forest">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="mt-4 font-mincho text-[1.2rem] leading-[1.65] text-forest underline-offset-8 group-hover:underline md:text-[1.35rem]">
                      {post.title}
                    </h2>

                    <p className="mt-3 max-w-[44rem] text-[0.9rem] leading-[1.95] text-moss">
                      {post.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-14 border-t border-ink/12 pt-10">
              <p className="text-[0.9rem] leading-[2] text-moss">
                ライチについて体系的に知りたい方は、
                <Link
                  href="/lychee"
                  className="mx-1 text-lychee-deep underline underline-offset-4 hover:text-lychee"
                >
                  ライチ完全ガイド
                </Link>
                をご覧ください。旬・栄養・食べ方・保存方法をまとめています。
              </p>
            </Reveal>
          </>
        )}
      </div>
    </>
  );
}
