import {
  availabilityFeedValue,
  visibleProducts,
  type Product,
} from "@/data/products";
import { absoluteUrl, isPublicSite, siteConfig } from "@/data/siteConfig";

/**
 * Googleショッピング（Merchant Center）用の商品フィード
 *
 * ─────────────────────────────────────────────
 * 使い方
 * ─────────────────────────────────────────────
 * Merchant Center の「商品データソース」で、次のURLを登録する。
 *   https://（本番ドメイン）/feed/products.xml
 *
 * data/products.ts に商品を追加すれば、このフィードにも自動で載る。
 *
 * ─────────────────────────────────────────────
 * 出力の条件
 * ─────────────────────────────────────────────
 * ・NEXT_PUBLIC_SITE_URL が未設定のあいだは空のフィードを返す
 *   （プレビューURLの商品をGoogleに登録させないため）
 * ・価格が未確定（price が null）の商品は含めない
 *   （Merchant Center は price を必須項目としているため）
 * ・画像が1枚もない商品も含めない
 *   （image_link が必須のため。写真を追加すれば自動的に載る）
 *
 * [TODO] 送料が確定したら <g:shipping> を追加すること。
 * Merchant Center 側で配送設定を登録する方法でも代替できる。
 */

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** フィードに載せられる商品か（必須項目が揃っているか） */
function isFeedable(product: Product): boolean {
  return product.price !== null && product.images.some((image) => image.src);
}

function itemXml(product: Product): string {
  const images = product.images
    .filter((image) => image.src)
    .map((image) => absoluteUrl(image.src as string));

  const description = [product.lead, ...product.description].join(" ");

  const extraImages = images
    .slice(1, 11)
    .map((url) => `      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
    .join("\n");

  return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(absoluteUrl(`/products/${product.slug}`))}</g:link>
      <g:image_link>${escapeXml(images[0])}</g:image_link>
${extraImages}
      <g:availability>${availabilityFeedValue[product.availability]}</g:availability>
      <g:price>${product.price} JPY</g:price>
      <g:condition>${product.condition}</g:condition>
      <g:brand>${escapeXml(siteConfig.name)}</g:brand>
      <g:product_type>食品 &gt; 果物 &gt; ライチ</g:product_type>
      <g:identifier_exists>${product.gtin ? "yes" : "no"}</g:identifier_exists>${
        product.gtin ? `\n      <g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ""
      }
    </item>`;
}

export function GET() {
  const items = isPublicSite ? visibleProducts.filter(isFeedable) : [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>鹿児島県指宿市山川の農園から、旬の生ライチを産地直送でお届けします。</description>
${items.map(itemXml).join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
