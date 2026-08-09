/**
 * 構造化データ（JSON-LD）ビルダー
 *
 * ─────────────────────────────────────────────
 * 絶対に守ること
 * ─────────────────────────────────────────────
 * - 存在しない review / aggregateRating を出力しない。
 * - 未確認の値（送料・郵便番号・品種など）は出力しない。
 *   siteConfig / products 側で null のものは、ここでも自動的に落ちる。
 * - 画面に表示していない内容を構造化データにだけ書かない。
 *   FAQ は「回答が確定していて画面にも出しているもの」だけを渡すこと。
 * - URLは data/siteConfig.ts の siteUrl（本番ドメイン）から組み立てる。
 *   ドメインを変えるときは siteConfig 側の1行だけを直せばよい。
 */

import { absoluteUrl, siteConfig, siteUrl } from "@/data/siteConfig";
import {
  availabilitySchema,
  type Product,
  visibleProducts,
} from "@/data/products";
import type { ColumnArticle } from "@/data/column";
import { GUIDE_ROOT, guidePath, type GuidePage } from "@/data/lycheeGuide";

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    addressCountry: "JP",
    ...(siteConfig.address.postalCode
      ? { postalCode: siteConfig.address.postalCode }
      : {}),
  };
}

/** 組織・農園の @id（他のスキーマから参照する） */
const ORGANIZATION_ID = `${siteUrl}/#organization`;

/** WebSite */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    alternateName: [siteConfig.nameKana, siteConfig.nameEn],
    url: absoluteUrl("/"),
    inLanguage: "ja",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * 農園・販売事業者（LocalBusiness）
 * 実際に農産物を生産し販売しているため Farm と Store の両方を名乗る。
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Farm"],
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: [siteConfig.nameKana, siteConfig.nameEn],
    description:
      "鹿児島県指宿市山川でライチをはじめとする熱帯果樹を育てている農園です。旬のあいだだけ、生ライチを農園から全国へ直接お届けしています。",
    url: absoluteUrl("/"),
    address: postalAddress(),
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    founder: { "@type": "Person", name: siteConfig.owner },
    employee: { "@type": "Person", name: siteConfig.owner },
    knowsAbout: ["ライチ", "生ライチ", "熱帯果樹", "国産ライチ"],
    sameAs: [siteConfig.instagram.url, siteConfig.externalShop.url],
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.hours.length
      ? {
          openingHoursSpecification: siteConfig.hours.map((block) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: block.days,
            opens: block.opens,
            closes: block.closes,
          })),
        }
      : {}),
    // aggregateRating / review は実在するレビューがないため出力しない。
  };
}

/** パンくずリスト */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * 商品（Product + Offer）
 * price が null の商品は Offer を付けない（価格未確定のため）。
 */
export function productJsonLd(product: Product) {
  const images = product.images
    .filter((image) => image.src)
    .map((image) => absoluteUrl(image.src as string));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${product.slug}#product`),
    sku: product.id,
    name: product.name,
    description: product.lead + product.description.join(""),
    category: "食品 > 果物 > ライチ",
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(images.length ? { image: images } : {}),
    ...(product.gtin ? { gtin: product.gtin } : {}),
    ...(product.volume
      ? {
          weight: {
            "@type": "QuantitativeValue",
            name: product.volume,
          },
        }
      : {}),
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.slug}`),
            price: String(product.price),
            priceCurrency: "JPY",
            availability: availabilitySchema[product.availability],
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": ORGANIZATION_ID },
            ...(product.saleEnd ? { priceValidUntil: product.saleEnd } : {}),
          },
        }
      : {}),
    // review / aggregateRating は実在しないため出力しない。
  };
}

/** 商品一覧（ItemList） */
export function productListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} オンラインショップ`,
    itemListElement: visibleProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}

/**
 * FAQ
 * 回答が確定していて、かつ画面にも表示しているものだけを渡すこと。
 */
export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * ライチ完全ガイドの各ページ（Article）
 *
 * author / publisher は農園そのもの（Organization）にしている。
 * 実在しない執筆者・監修者を Person として立てないこと。
 * review / aggregateRating も出力しない。
 */
export function guideArticleJsonLd(page: GuidePage) {
  const url = absoluteUrl(guidePath(page.slug));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.h1,
    description: page.description,
    inLanguage: "ja",
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: url,
    about: { "@type": "Thing", name: "ライチ" },
    ...(page.hero.src ? { image: absoluteUrl(page.hero.src) } : {}),
    isPartOf: {
      "@type": "WebPage",
      "@id": absoluteUrl(GUIDE_ROOT),
      name: "ライチ完全ガイド",
    },
  };
}

/** コラム記事（Article） */
export function articleJsonLd(article: ColumnArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/column/${article.slug}#article`),
    headline: article.title,
    description: article.excerpt,
    inLanguage: "ja",
    datePublished: article.date,
    ...(article.updated ? { dateModified: article.updated } : {}),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: absoluteUrl(`/column/${article.slug}`),
  };
}
