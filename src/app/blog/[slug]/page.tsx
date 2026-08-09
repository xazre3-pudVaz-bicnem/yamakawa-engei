import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import ShopCta from "@/components/guide/ShopCta";
import {
  categorySlug,
  getBlogPost,
  getBlogSlugs,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { getGuidePage } from "@/data/lycheeGuide";
import { siteConfig } from "@/data/siteConfig";
import { blogArticleJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

/**
 * ブログ記事（/blog/[slug]）
 *
 * 本文は content/blog/*.md（Claude API が毎日生成）。
 * Markdown は react-markdown で描画し、サイトの組版（.prose-farm）に合わせる。
 *
 * 記事は「ライチ完全ガイドの支援記事」という位置づけなので、
 * frontmatter の pillar に入っているガイドページへ必ず導線を置く。
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "記事が見つかりません", robots: { index: false } };

  return {
    ...buildMetadata({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      keywords: post.tags,
      type: "article",
    }),
    openGraph: {
      title: `${post.title}｜${siteConfig.name}`,
      description: post.description,
      siteName: siteConfig.name,
      locale: "ja_JP",
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(slug);
  /** frontmatter の pillar が /lychee 配下なら、そのガイドページの情報を引く */
  const pillarSlug = post.pillar.startsWith("/lychee")
    ? post.pillar.replace(/^\/lychee\/?/, "")
    : null;
  const pillarPage = pillarSlug !== null ? getGuidePage(pillarSlug) : undefined;

  return (
    <>
      <JsonLd data={blogArticleJsonLd(post)} />

      <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-36">
        <Breadcrumbs
          items={[
            { name: "ブログ", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <header className="mt-9">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <time
              dateTime={post.date}
              className="tnum font-serif-en text-[0.78rem] tracking-[0.1em] text-moss"
            >
              {formatDate(post.date)}
            </time>
            <Link
              href={`/blog/category/${categorySlug(post.category)}`}
              className="border border-leaf/40 px-2.5 py-0.5 text-[0.7rem] tracking-[0.1em] text-forest transition-colors hover:border-forest"
            >
              {post.category}
            </Link>
          </div>

          <h1 className="mt-5 font-mincho text-[1.55rem] leading-[1.6] text-forest md:text-[2rem]">
            {post.title}
          </h1>

          <span aria-hidden="true" className="mt-8 block h-px w-16 bg-leaf/60" />

          <p className="mt-6 text-[0.8rem] leading-[1.9] text-moss">
            発信：
            <Link
              href="/about"
              className="mx-1 underline underline-offset-4 hover:text-forest"
            >
              {siteConfig.name}
            </Link>
            （{siteConfig.address.full}）
          </p>
        </header>

        {/* 本文（Markdown）
            .prose-farm … サイト共通の組版（見出し・段落・リンク）
            .md-body    … Markdown特有の要素（リスト・表・引用）の体裁 */}
        <div className="prose-farm md-body mt-12 text-[0.95rem] text-ink/85">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 表は横長になりがちなので、表だけを横スクロールさせる。
              // ページ全体が横に伸びると、スマホで読みにくくなるため。
              table: ({ children }) => (
                <div className="table-scroll">
                  <table>{children}</table>
                </div>
              ),
              // 生成された本文に外部リンクが混ざっても安全に開けるようにする
              a: ({ href, children }) => {
                const url = String(href ?? "");
                if (url.startsWith("/") || url.startsWith("#")) {
                  return <Link href={url}>{children}</Link>;
                }
                return (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 支えている柱のガイドページへ */}
        {pillarPage && (
          <Reveal className="mt-14 border border-ink/12 bg-paper-warm px-6 py-7 md:px-8">
            <p className="font-serif-en text-[0.66rem] uppercase tracking-[0.28em] text-lychee-deep">
              Lychee guide
            </p>
            <h2 className="mt-3 font-mincho text-[1.08rem] leading-[1.7] text-forest">
              {pillarPage.navLabel}
            </h2>
            <p className="mt-3 text-[0.9rem] leading-[1.95] text-ink/80">
              {pillarPage.navDescription}
            </p>
            <p className="mt-5">
              <Link
                href={post.pillar}
                className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                {pillarPage.navLabel}をくわしく読む
              </Link>
            </p>
          </Reveal>
        )}

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-[0.8rem] text-moss">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
      </article>

      {/* 商品への導線 */}
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 md:px-8 md:pb-24">
        <Reveal>
          <ShopCta location={`/blog/${post.slug}`} />
        </Reveal>
      </div>

      {/* 関連記事 */}
      {related.length > 0 && (
        <section className="bg-paper-warm">
          <div className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-20">
            <Reveal>
              <h2 className="font-mincho text-[1.2rem] leading-snug text-forest md:text-[1.4rem]">
                ほかの記事
              </h2>
              <span
                aria-hidden="true"
                className="reveal-line mt-6 block h-px w-14 bg-leaf/60"
              />
            </Reveal>

            <Reveal className="mt-9">
              <ul className="divide-y divide-ink/12 border-y border-ink/12">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group block py-5"
                    >
                      <span className="tnum font-serif-en text-[0.74rem] tracking-[0.1em] text-moss">
                        {formatDate(item.date)}
                      </span>
                      <span className="mt-2 block font-mincho text-[1rem] leading-[1.7] text-forest underline-offset-8 group-hover:underline">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-9">
              <Link
                href="/blog"
                className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                ブログ一覧へ戻る
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
