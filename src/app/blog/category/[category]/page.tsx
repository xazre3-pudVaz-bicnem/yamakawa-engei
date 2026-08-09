import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  categoryName,
  getBlogCategoriesInUse,
  getBlogPostsByCategory,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

/**
 * カテゴリー別のブログ一覧（/blog/category/[category]）
 *
 * 記事が1件もないカテゴリーはページを作らない（generateStaticParams で除外）。
 * 空のカテゴリーページが量産されると、中身のないURLが増えてしまうため。
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogCategoriesInUse().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = categoryName(category);
  if (!name) return { title: "カテゴリーが見つかりません", robots: { index: false } };

  return buildMetadata({
    title: `${name}｜ライチのブログ`,
    description: `${name}に関する記事の一覧です。鹿児島県指宿市山川のライチ農園、山川園芸がお届けします。`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = categoryName(category);
  if (!name) notFound();

  const posts = getBlogPostsByCategory(category);
  if (posts.length === 0) notFound();

  const others = getBlogCategoriesInUse().filter((c) => c.slug !== category);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={name}
        lead={`${name}に関する記事をまとめました。`}
        crumbs={[
          { name: "ブログ", path: "/blog" },
          { name, path: `/blog/category/${category}` },
        ]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        <ul className="border-t border-ink/12">
          {posts.map((post) => (
            <Reveal as="li" key={post.slug} className="border-b border-ink/12">
              <Link href={`/blog/${post.slug}`} className="group block py-9">
                <time
                  dateTime={post.date}
                  className="tnum font-serif-en text-[0.78rem] tracking-[0.1em] text-moss"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-4 font-mincho text-[1.2rem] leading-[1.65] text-forest underline-offset-8 group-hover:underline md:text-[1.3rem]">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-[44rem] text-[0.9rem] leading-[1.95] text-moss">
                  {post.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>

        {others.length > 0 && (
          <Reveal className="mt-14 border-t border-ink/12 pt-10">
            <h2 className="font-mincho text-[1.05rem] text-forest">
              ほかのカテゴリー
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/category/${item.slug}`}
                    className="text-[0.87rem] text-moss underline underline-offset-8 transition-colors hover:text-forest"
                  >
                    {item.name}
                    <span className="tnum ml-1.5 text-[0.78rem]">
                      ({item.count})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal className="mt-10">
          <Link
            href="/blog"
            className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
          >
            ブログ一覧へ戻る
          </Link>
        </Reveal>
      </div>
    </>
  );
}
