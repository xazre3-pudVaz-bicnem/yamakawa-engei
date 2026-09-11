import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerBox from "@/components/guide/AnswerBox";
import ShopCta from "@/components/guide/ShopCta";
import FruitFarmPhotos from "@/components/sections/fruits/FruitFarmPhotos";
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
 * 内容はすべて src/data/fruits.ts から作る。
 * このファイルに果物の説明を直接書かないこと。
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

  // FaqList は FAQ ページと同じ部品を使う
  const faqItems: FaqItem[] = faqs.map((faq, index) => ({
    id: `${fruit.slug}-${index}`,
    category: "farm",
    question: faq.question,
    answer: faq.answer,
  }));

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

      {/* ---- とは ---- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
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
          </Reveal>
        </div>
      </section>

      {/* ---- 農園の様子 ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal className="max-w-2xl">
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.28em] text-leaf">
              At the farm
            </p>
            <h2 className="mt-4 font-mincho text-[1.4rem] leading-[1.6] text-forest md:text-[1.75rem]">
              {fruit.farm.heading}
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <div className="mt-7 space-y-4 text-[0.94rem] leading-[2.05] text-ink/85">
              {fruit.farm.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-12" delay={0.06}>
            <FruitFarmPhotos photos={fruit.farm.photos} />
          </Reveal>
        </div>
      </section>

      {/* ---- 特徴と食べ方 ---- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              {fruit.name}の特徴
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <dl className="mt-9 divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
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
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              {fruit.name}の食べ方
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <ol className="mt-9 space-y-6">
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

            {fruit.cautions.length > 0 ? (
              <div className="mt-10 border border-ink/12 bg-paper-warm px-5 py-5">
                <p className="font-mincho text-[0.98rem] text-forest">
                  ご注意
                </p>
                <ul className="mt-3 space-y-2 text-[0.86rem] leading-[1.9] text-ink/80">
                  {fruit.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* ---- よくある質問 ---- */}
      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              {fruit.name}のよくある質問
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
          </Reveal>
          <Reveal className="mt-10" delay={0.06}>
            <FaqList items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* ---- お取り扱い ----
          販売する果物なら商品へ（赤＝購入導線）。
          販売しない果物は、その旨を短く伝えて山川園芸のライチへつなぐ。
          購入の問い合わせへは誘導しない。 */}
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
        <section className="mx-auto w-full max-w-5xl px-5 pb-4 pt-4 md:px-8">
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
