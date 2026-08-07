import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import {
  columnCategoryLabel,
  columns,
  getColumn,
  getRelatedColumns,
} from "@/data/column";
import { articleJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return columns.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getColumn(slug);

  if (!article) {
    return { title: "記事が見つかりません", robots: { index: false } };
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/column/${article.slug}`,
    keywords: article.keywords,
    type: "article",
  });
}

export default async function ColumnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getColumn(slug);

  if (!article) notFound();

  const related = getRelatedColumns(article);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />

      <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
        <Breadcrumbs
          items={[
            { name: "コラム", path: "/column" },
            { name: article.title, path: `/column/${article.slug}` },
          ]}
        />

        <header className="mt-9">
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
            {article.updated && (
              <span className="text-[0.75rem] text-moss">
                {formatDate(article.updated)} 更新
              </span>
            )}
          </div>

          <h1 className="mt-5 font-mincho text-[1.6rem] leading-[1.6] text-forest md:text-[2.05rem]">
            {article.title}
          </h1>
          <span aria-hidden="true" className="mt-8 block h-px w-16 bg-leaf/60" />
        </header>

        <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
          {article.body.map((block, index) => {
            switch (block.type) {
              case "h2":
                return <h2 key={index}>{block.text}</h2>;
              case "h3":
                return <h3 key={index}>{block.text}</h3>;
              case "p":
                return <p key={index}>{block.text}</p>;
              case "ul":
                return (
                  <ul key={index} className="space-y-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "note":
                return (
                  <p
                    key={index}
                    className="border border-ink/12 bg-paper-warm px-5 py-4 text-[0.87rem] leading-[1.95] text-moss"
                  >
                    {block.text}
                  </p>
                );
            }
          })}
        </div>

        {/* 関連ページ */}
        {article.related.length > 0 && (
          <Reveal className="mt-16 border-t border-ink/12 pt-9">
            <h2 className="font-mincho text-[1.05rem] text-forest">
              あわせてご覧ください
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              {article.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* 他の記事 */}
        {related.length > 0 && (
          <Reveal className="mt-14 border-t border-ink/12 pt-9">
            <h2 className="font-mincho text-[1.05rem] text-forest">
              ほかの記事
            </h2>
            <ul className="mt-5 divide-y divide-ink/12">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/column/${item.slug}`}
                    className="group block py-5"
                  >
                    <span className="font-mincho text-[1rem] leading-[1.7] text-forest underline-offset-8 group-hover:underline">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-[0.85rem] leading-[1.9] text-moss">
                      {item.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal className="mt-14">
          <Link
            href="/column"
            className="text-[0.88rem] text-moss underline underline-offset-8 hover:text-forest"
          >
            コラム一覧へ
          </Link>
        </Reveal>
      </article>
    </>
  );
}
