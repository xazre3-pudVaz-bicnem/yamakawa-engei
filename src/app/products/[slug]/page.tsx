import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/cart/AddToCart";
import ProductGallery from "@/components/product/ProductGallery";
import ProductRow from "@/components/product/ProductRow";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FaqList from "@/components/ui/FaqList";
import JsonLd from "@/components/ui/JsonLd";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  getProduct,
  getRelatedProducts,
  lycheeVarieties,
  visibleProducts,
} from "@/data/products";
import { faqs } from "@/data/faq";
import { shippingConfig, siteConfig } from "@/data/siteConfig";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";

/** 商品ページで見せるFAQ（回答が確定しているものだけ） */
const PRODUCT_FAQ_IDS = [
  "how-to-eat",
  "storage",
  "dispatch",
  "cancel",
  "restock",
];

export function generateStaticParams() {
  return visibleProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "商品が見つかりません", robots: { index: false } };
  }

  const price = formatPrice(product.price);

  return buildMetadata({
    title: `${product.name}｜国産の生ライチ通販`,
    description: `${product.lead}${product.volume ? `内容量${product.volume}。` : ""}${price ? `${price}（税込・送料別）。` : ""}鹿児島県指宿市山川の山川園芸から産地直送でお届けします。`,
    path: `/products/${product.slug}`,
    keywords: ["生ライチ 通販", "国産ライチ", "鹿児島 ライチ", "ライチ お取り寄せ"],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product);
  const productFaqs = faqs.filter(
    (faq) => PRODUCT_FAQ_IDS.includes(faq.id) && faq.answer,
  );

  /** 仕様表。未確認（null）の項目は行ごと表示しない */
  const specs: Array<{ term: string; value: string | null }> = [
    { term: "内容量", value: product.volume },
    { term: "個数の目安", value: product.countGuide },
    { term: "産地", value: product.origin },
    {
      term: "品種",
      value: product.showVarieties
        ? lycheeVarieties
            .map((group) => `${group.period}：${group.names.join("、")}`)
            .join(" ／ ")
        : null,
    },
    { term: "お届け時期", value: product.shippingSchedule },
    { term: "配送方法", value: product.shippingMethod },
    { term: "保存方法", value: product.storage },
    { term: "包装", value: product.packaging },
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      {productFaqs.length > 0 && (
        <JsonLd
          data={faqJsonLd(
            productFaqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer as string,
            })),
          )}
        />
      )}

      <div className="mx-auto w-full max-w-6xl px-5 pt-28 md:px-8 md:pt-32">
        <Breadcrumbs
          items={[
            { name: "オンラインショップ", path: "/shop" },
            { name: product.name, path: `/products/${product.slug}` },
          ]}
        />
      </div>

      {/* ================= 購入エリア ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <StatusBadge status={product.availability} />

            <h1 className="mt-5 font-mincho text-[1.65rem] leading-[1.5] text-forest md:text-[2.1rem]">
              {product.name}
            </h1>

            <p className="mt-5 text-[0.95rem] leading-[2.05] text-ink/85">
              {product.lead}
            </p>

            <div className="mt-8 border-y border-ink/12 py-6">
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="tnum font-mincho text-[1.9rem] text-ink">
                  {formatPrice(product.price) ?? "価格は準備中"}
                </span>
                {product.price !== null && (
                  <span className="text-[0.78rem] text-moss">
                    税込／送料別
                  </span>
                )}
              </p>
              {(product.volume || product.countGuide) && (
                <p className="mt-2 text-[0.85rem] text-moss">
                  {[product.volume, product.countGuide]
                    .filter(Boolean)
                    .join("／")}
                </p>
              )}
            </div>

            <div className="mt-7">
              <AddToCart product={product} />
            </div>

            {/* 仕様 */}
            <dl className="mt-9 divide-y divide-ink/12 border-t border-ink/12 text-[0.86rem]">
              {specs
                .filter((spec) => spec.value)
                .map((spec) => (
                  <div key={spec.term} className="flex gap-5 py-4">
                    <dt className="w-24 shrink-0 text-moss">{spec.term}</dt>
                    <dd className="leading-[1.9]">{spec.value}</dd>
                  </div>
                ))}
              <div className="flex gap-5 py-4">
                <dt className="w-24 shrink-0 text-moss">発送</dt>
                <dd className="leading-[1.9]">
                  {shippingConfig.dispatchLead}
                  <span className="mt-1 block text-moss">
                    {shippingConfig.note}
                  </span>
                </dd>
              </div>
            </dl>

            {/* 未確認項目のお知らせ（作り話をしないための導線） */}
            {(!product.shippingSchedule || !product.shippingMethod) && (
              <p className="mt-6 border border-ink/12 bg-paper-warm px-5 py-4 text-[0.82rem] leading-[1.9] text-moss">
                お届け時期・配送方法の詳細は、収穫の状況にあわせてご案内しています。
                お急ぎの場合は
                <Link
                  href="/contact"
                  className="mx-1 text-lychee-deep underline underline-offset-4"
                >
                  お問い合わせ
                </Link>
                よりご連絡ください。
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= 商品の説明 ================= */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="font-mincho text-[1.45rem] leading-snug text-forest md:text-[1.8rem]">
              この果物について
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <div className="mt-9 space-y-6 text-[0.95rem] leading-[2.1] text-ink/85">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-14">
            <Reveal>
              <h3 className="font-mincho text-[1.15rem] text-forest">
                味・特徴
              </h3>
              <ul className="mt-6 space-y-3 text-[0.92rem] leading-[1.95] text-ink/80">
                {product.features.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <h3 className="font-mincho text-[1.15rem] text-forest">
                おすすめの食べ方
              </h3>
              <ul className="mt-6 space-y-3 text-[0.92rem] leading-[1.95] text-ink/80">
                {product.eatingSuggestions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3.5 h-px w-4 shrink-0 bg-leaf/70"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link
                  href="/how-to-eat"
                  className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                >
                  皮のむき方・保存方法をくわしく見る
                </Link>
              </p>
            </Reveal>
          </div>

          {product.cautions.length > 0 && (
            <Reveal className="mt-14 border border-ink/12 bg-paper px-6 py-7">
              <h3 className="font-mincho text-[1.02rem] text-forest">
                お召し上がりの前に
              </h3>
              <ul className="mt-5 space-y-2.5 text-[0.87rem] leading-[1.95] text-ink/80">
                {product.cautions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3.5 h-px w-3 shrink-0 bg-ink/30"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {/* ================= 生産地・農園 ================= */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
          <Reveal>
            <Photo
              src="/images/farm/lychee-trees.jpg"
              alt="ハウスで育つ山川園芸のライチの木"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 45vw, 100vw"
              tone="leaf"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Producer
            </p>
            <h2 className="mt-5 font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              つくっているのは、{siteConfig.name}です
            </h2>
            <p className="mt-6 text-[0.93rem] leading-[2.05] text-ink/85">
              薩摩半島のいちばん南、{siteConfig.address.full}。
              海に囲まれたこの土地で、ライチをはじめとする熱帯果樹を育てています。
              穫れた実は、市場を通さず農園から直接お届けしています。
            </p>
            <p className="mt-7">
              <Link
                href="/about"
                className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                山川園芸について
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      {productFaqs.length > 0 && (
        <section className="bg-paper-warm">
          <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-24">
            <Reveal>
              <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
                この商品についてのご質問
              </h2>
              <span
                aria-hidden="true"
                className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
              />
            </Reveal>
            <Reveal className="mt-10">
              <FaqList items={productFaqs} />
            </Reveal>
            <Reveal className="mt-8">
              <Link
                href="/faq"
                className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                よくある質問をすべて見る
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ================= 関連商品 ================= */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              ほかの商品
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
          </Reveal>
          <div className="mt-14 space-y-20">
            {related.map((item, index) => (
              <Reveal key={item.slug}>
                <ProductRow product={item} reverse={index % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
