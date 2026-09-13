import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerBox from "@/components/guide/AnswerBox";
import CompareTable from "@/components/guide/CompareTable";
import FarmNote from "@/components/guide/FarmNote";
import ShopCta from "@/components/guide/ShopCta";
import SourceList from "@/components/guide/SourceList";
import FruitFarmPhotos from "@/components/sections/fruits/FruitFarmPhotos";
import FruitToc, { FruitSection } from "@/components/sections/fruits/FruitToc";
import FaqList from "@/components/ui/FaqList";
import JsonLd from "@/components/ui/JsonLd";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import type { FaqItem } from "@/data/faq";
import {
  fruitDisplayName,
  fruitFaqs,
  fruitPath,
  fruits,
  getFruit,
  getFruitProduct,
} from "@/data/fruits";
import { faqJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";

/**
 * 育てている果物の詳細（/fruits/[slug]）
 *
 * ─────────────────────────────────────────────
 * このページの考え方
 * ─────────────────────────────────────────────
 * その果物を調べに来た人が知りたいことを、1ページで最後まで answer しきる。
 * ページを細かく割らないのは、同じ検索意図のページを増やすと
 * 共食いになるため（ライチ完全ガイドと同じ考え方）。
 *
 * 内容はすべて src/data/fruits.ts から作る。
 * このファイルに果物の説明を直接書かないこと。
 * 用意されていない節は、その節ごと出ない。
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return fruits.map((fruit) => ({ slug: fruit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fruit = getFruit(slug);
  if (!fruit) return { title: "ページが見つかりません", robots: { index: false } };

  const meta = buildMetadata({
    title: fruit.meta.title,
    description: fruit.meta.description,
    path: fruitPath(fruit.slug),
    keywords: fruit.meta.keywords,
  });

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: fruit.hero.src, alt: fruit.hero.alt }],
    },
  };
}

export default async function FruitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fruit = getFruit(slug);
  if (!fruit) notFound();

  const path = fruitPath(fruit.slug);
  const product = getFruitProduct(fruit);
  const faqs = fruitFaqs(fruit);
  const others = fruits.filter((item) => item.slug !== fruit.slug);

  const faqItems: FaqItem[] = faqs.map((faq, index) => ({
    id: `${fruit.slug}-${index}`,
    category: "farm",
    question: faq.question,
    answer: faq.answer,
  }));

  /** 目次。用意されている節だけを並べる */
  const toc = [
    fruit.background ? { id: "background", label: `${fruit.name}とは` } : null,
    { id: "farm", label: fruit.farm.heading },
    { id: "features", label: "特徴" },
    fruit.compare ? { id: "compare", label: fruit.compare.heading } : null,
    fruit.howToChoose ? { id: "choose", label: "選び方・食べごろ" } : null,
    { id: "eat", label: "食べ方" },
    fruit.storage ? { id: "storage", label: "保存方法" } : null,
    fruit.nutrition ? { id: "nutrition", label: "栄養成分" } : null,
    { id: "faq", label: "よくある質問" },
  ].filter((item): item is { id: string; label: string } => item !== null);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHero
        eyebrow={fruit.nameEn}
        title={fruitDisplayName(fruit)}
        lead={fruit.lead}
        crumbs={[
          { name: "育てている果物", path: "/fruits" },
          { name: fruit.name, path },
        ]}
      />

      {/* ---- 導入：写真・最短回答・目次 ---- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-16">
          <Reveal>
            <figure>
              <Photo
                src={fruit.hero.src}
                alt={fruit.hero.alt}
                aspect="aspect-[4/5]"
                sizes="(min-width: 1152px) 520px, (min-width: 768px) 46vw, 100vw"
                priority
                tone="leaf"
              />
              <figcaption className="mt-3 text-[0.8rem] leading-[1.8] text-moss">
                {fruit.hero.caption}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08}>
            <AnswerBox question={fruit.answer.question}>
              <p>{fruit.answer.body}</p>
            </AnswerBox>

            <div className="mt-9 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
              {fruit.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {fruit.otherNames.length > 0 ? (
              <p className="mt-7 text-[0.85rem] leading-[1.9] text-moss">
                別名：{fruit.otherNames.join("、")}
              </p>
            ) : null}

            <div className="mt-10">
              <FruitToc items={toc} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- とは ---- */}
      {fruit.background ? (
        <div className="mx-auto w-full max-w-3xl px-5 pb-4 md:px-8">
          <Reveal as="section">
            <FruitSection id="background" heading={`${fruit.name}とは`}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
                {fruit.background.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </FruitSection>
          </Reveal>
        </div>
      ) : null}

      {/* ---- 農園の様子（写真を広く見せたいので幅を戻す） ---- */}
      <section className="mt-20 bg-paper-warm md:mt-24">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal className="max-w-2xl">
            <FruitSection id="farm" heading={fruit.farm.heading}>
              <div className="mt-7 space-y-4 text-[0.94rem] leading-[2.05] text-ink/85">
                {fruit.farm.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </FruitSection>
          </Reveal>

          <Reveal className="mt-12" delay={0.06}>
            <FruitFarmPhotos photos={fruit.farm.photos} />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl space-y-20 px-5 py-20 md:space-y-24 md:px-8 md:py-24">
        {/* ---- 特徴 ---- */}
        <Reveal as="section">
          <FruitSection id="features" heading={`${fruit.name}の特徴`}>
            <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
              {fruit.features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8"
                >
                  <dt className="w-20 shrink-0 text-moss">{feature.label}</dt>
                  <dd className="leading-[1.9]">{feature.value}</dd>
                </div>
              ))}
              {fruit.harvestSeason ? (
                <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                  <dt className="w-20 shrink-0 text-moss">収穫</dt>
                  <dd className="leading-[1.9]">{fruit.harvestSeason}</dd>
                </div>
              ) : null}
            </dl>
          </FruitSection>
        </Reveal>

        {/* ---- 比べてみる ---- */}
        {fruit.compare ? (
          <Reveal as="section">
            <FruitSection id="compare" heading={fruit.compare.heading}>
              {fruit.compare.body ? (
                <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
                  {fruit.compare.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              <CompareTable
                caption={fruit.compare.caption}
                columns={fruit.compare.columns}
                rows={fruit.compare.rows}
              />
            </FruitSection>
          </Reveal>
        ) : null}

        {/* ---- 選び方・食べごろ ---- */}
        {fruit.howToChoose ? (
          <Reveal as="section">
            <FruitSection id="choose" heading={`${fruit.name}の選び方・食べごろ`}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
                {fruit.howToChoose.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-4 text-[0.92rem] leading-[2] text-ink/80">
                {fruit.howToChoose.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </FruitSection>
          </Reveal>
        ) : null}

        {/* ---- 食べ方 ---- */}
        <Reveal as="section">
          <FruitSection id="eat" heading={`${fruit.name}の食べ方`}>
            <ol className="mt-8 space-y-6">
              {fruit.howToEat.map((step, index) => (
                <li key={step} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="font-serif-en text-[1.5rem] leading-none text-leaf"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-[0.94rem] leading-[1.95] text-ink/85">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            {fruit.howToEatPhoto ? (
              <figure className="mt-10">
                <Photo
                  src={fruit.howToEatPhoto.src}
                  alt={fruit.howToEatPhoto.alt}
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 768px) 46rem, 100vw"
                  tone="leaf"
                />
                <figcaption className="mt-3 text-[0.8rem] leading-[1.8] text-moss">
                  {fruit.howToEatPhoto.caption}
                </figcaption>
              </figure>
            ) : null}

            {fruit.farmNote ? (
              <div className="mt-10">
                <FarmNote title={`${fruit.name}のおすすめの食べ方`} fromProducer>
                  {fruit.farmNote.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </FarmNote>
              </div>
            ) : null}

            {fruit.cautions.length > 0 ? (
              <div className="mt-10 border border-ink/12 bg-paper-warm px-5 py-5">
                <p className="font-mincho text-[0.98rem] text-forest">ご注意</p>
                <ul className="mt-3 space-y-2 text-[0.86rem] leading-[1.9] text-ink/80">
                  {fruit.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </FruitSection>
        </Reveal>

        {/* ---- 保存方法 ---- */}
        {fruit.storage ? (
          <Reveal as="section">
            <FruitSection id="storage" heading={`${fruit.name}の保存方法`}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
                {fruit.storage.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-4 text-[0.92rem] leading-[2] text-ink/80">
                {fruit.storage.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </FruitSection>
          </Reveal>
        ) : null}

        {/* ---- 栄養 ---- */}
        {fruit.nutrition ? (
          <Reveal as="section">
            <FruitSection id="nutrition" heading={`${fruit.name}の栄養成分`}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.05] text-ink/85">
                {fruit.nutrition.note.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <table className="mt-8 w-full border-collapse text-left text-[0.9rem]">
                <caption className="sr-only">
                  {fruit.nutrition.foodName}の可食部100gあたりの成分値
                </caption>
                <thead>
                  <tr className="border-y border-ink/15">
                    <th scope="col" className="py-4 pr-4 font-normal text-moss">
                      成分
                    </th>
                    <th
                      scope="col"
                      className="w-32 py-4 text-right font-normal text-moss"
                    >
                      100gあたり
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/12">
                  {fruit.nutrition.per100g.map((row) => (
                    <tr key={row.name}>
                      <th scope="row" className="py-4 pr-4 font-normal">
                        {row.name}
                      </th>
                      <td className="tnum py-4 text-right align-top">
                        <span className="font-mincho text-[1.02rem] text-forest">
                          {row.value}
                        </span>
                        <span className="ml-1 text-[0.78rem] text-moss">
                          {row.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-5 text-[0.82rem] leading-[1.9] text-moss">
                出典：文部科学省「日本食品標準成分表（八訂）増補2023年」
                {fruit.nutrition.foodName}（食品番号 {fruit.nutrition.foodCode}）。
                可食部100gあたりの値です。品種や熟し方、育った環境によって変わります。
              </p>
            </FruitSection>
          </Reveal>
        ) : null}

        {/* ---- よくある質問 ---- */}
        <Reveal as="section">
          <FruitSection id="faq" heading={`${fruit.name}のよくある質問`}>
            <div className="mt-8">
              <FaqList items={faqItems} />
            </div>
          </FruitSection>
        </Reveal>

        {/* ---- 参考資料 ---- */}
        {fruit.sources && fruit.sources.length > 0 ? (
          <Reveal as="section">
            <SourceList items={fruit.sources} checkedAt={fruit.sourcesCheckedAt} />
          </Reveal>
        ) : null}
      </div>

      {/* ---- お取り扱い ----
          販売する果物なら商品へ（赤＝購入導線）。
          販売しない果物は、その旨を短く伝えて山川園芸のライチへつなぐ。 */}
      {product ? (
        <section className="bg-forest-deep text-paper">
          <div className="mx-auto w-full max-w-4xl px-5 py-20 text-center md:px-8 md:py-24">
            <Reveal>
              <h2 className="font-mincho text-[1.35rem] leading-[1.7] md:text-[1.6rem]">
                {product.name}
              </h2>
              <p className="mt-5 text-[0.92rem] leading-[2] text-paper/80">
                {formatPrice(product.price)}（税込・送料別）
              </p>
              <Link
                href={`/products/${product.slug}`}
                className="mt-9 inline-flex items-center justify-center border border-lychee bg-lychee px-9 py-4 text-[0.92rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
              >
                商品を見る
              </Link>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-5xl px-5 pb-4 md:px-8">
          <Reveal>
            <p className="text-center text-[0.9rem] leading-[2] text-moss">
              {fruit.name}は販売していません。
              オンラインショップでお届けしているのは、指宿・山川で育てた生ライチです。
            </p>
          </Reveal>
          <Reveal className="mt-10" delay={0.06}>
            <ShopCta location={path} />
          </Reveal>
        </section>
      )}

      {/* ---- ほかの果物 ---- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <h2 className="font-mincho text-[1.3rem] leading-snug text-forest md:text-[1.5rem]">
            山川園芸で育てている、ほかの果物
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
          {others.map((other, index) => (
            <Reveal key={other.slug} delay={index * 0.06}>
              <Link
                href={fruitPath(other.slug)}
                className="group grid grid-cols-[7rem_1fr] items-center gap-5 md:grid-cols-[9rem_1fr] md:gap-7"
              >
                <Photo
                  src={other.hero.src}
                  alt={other.hero.alt}
                  aspect="aspect-[4/5]"
                  sizes="144px"
                  tone="leaf"
                />
                <span>
                  <span className="block font-serif-en text-[0.66rem] uppercase tracking-[0.24em] text-leaf">
                    {other.nameEn}
                  </span>
                  <span className="mt-2 block font-mincho text-[1.1rem] text-forest underline-offset-4 group-hover:underline">
                    {other.name}について見る
                  </span>
                  <span className="mt-2 block text-[0.84rem] leading-[1.85] text-moss">
                    {other.lead}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-ink/12 pt-8" delay={0.1}>
          <ul className="flex flex-col gap-3 text-[0.9rem] sm:flex-row sm:flex-wrap sm:gap-x-8">
            {fruit.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-lychee-deep underline underline-offset-8 hover:text-lychee"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/fruits"
                className="text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                育てている果物の一覧に戻る
              </Link>
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
