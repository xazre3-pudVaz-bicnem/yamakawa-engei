/**
 * 商品データ
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * products 配列に1件追加するだけで、
 *   /shop（一覧）
 *   /products/[slug]（詳細）
 *   sitemap.xml
 *   Product / Offer 構造化データ
 *   Googleショッピング用フィード項目
 * にすべて反映される。JSXに商品を直接書かないこと。
 *
 * ─────────────────────────────────────────────
 * 記載ルール（重要）
 * ─────────────────────────────────────────────
 * - 未確認の項目は必ず null。推測で値を入れない。
 *   null の項目は画面から自動的に消え、構造化データにも出力されない。
 * - 出典の凡例
 *   [公式] 公式オンラインショップ（BASE）の商品ページ掲載内容
 *   [TODO] 未確認。要ヒアリング
 */

import { siteConfig } from "./siteConfig";

/* ================================================================
   型定義
================================================================ */

/** 商品カテゴリー（将来ここに追加するだけで一覧の絞り込みが増える） */
export type ProductCategoryId =
  | "lychee"
  | "tropical-fruit"
  | "seedling"
  | "seasonal"
  | "other";

export type ProductCategory = {
  id: ProductCategoryId;
  name: string;
  /** 一覧ページで使う短い説明 */
  description: string;
};

/** 在庫・販売状況 */
export type ProductAvailability =
  /** 販売中（カートに入れられる） */
  | "in_stock"
  /** 予約受付中（カートに入れられる） */
  | "preorder"
  /** 売り切れ */
  | "sold_out"
  /** 販売準備中・今季開始前 */
  | "coming_soon"
  /** 一覧・詳細ともに非公開（下書き） */
  | "draft";

export type ProductImage = {
  /**
   * /public 配下のパス。写真が未提供のあいだは null のままにする。
   * null の枠には、入れるべき写真を示すプレースホルダーが表示される。
   */
  src: string | null;
  /** next/image の alt。写真の内容をそのまま日本語で書く */
  alt: string;
  /** 写真がない場合にプレースホルダーへ表示する被写体名 */
  slot: string;
};

export type Product = {
  /** Googleショッピング（Merchant Center）の id にそのまま使う一意なID */
  id: string;
  /** URL に使うスラッグ（/products/[slug]） */
  slug: string;
  /** 商品名 */
  name: string;
  /** 一覧・カートで使う短い名前 */
  shortName: string;
  category: ProductCategoryId;

  /** 税込価格（円）。未確定なら null */
  price: number | null;
  /** 価格が税込かどうか */
  taxIncluded: boolean;
  /** 価格の出典・注記。未確定なら null */
  priceNote: string | null;

  /** 内容量（例: "500g"）。未確認なら null */
  volume: string | null;
  /** 個数の目安（例: "約12〜13粒"）。未確認なら null */
  countGuide: string | null;

  availability: ProductAvailability;
  /** 1回のご注文で選べる最大数量 */
  maxQuantity: number;

  /** 販売開始日（ISO文字列）。未定なら null */
  saleStart: string | null;
  /** 販売終了日（ISO文字列）。未定なら null */
  saleEnd: string | null;
  /** お届け時期の目安。未確認なら null */
  shippingSchedule: string | null;
  /** 配送方法・温度帯。未確認なら null */
  shippingMethod: string | null;

  /** 産地 */
  origin: string;
  /** 保存方法。未確認なら null */
  storage: string | null;
  /** 包装について。未確認なら null */
  packaging: string | null;
  /** この商品に lycheeVarieties（品種一覧）を表示するか */
  showVarieties: boolean;

  /** 一覧・詳細の冒頭に置く一文 */
  lead: string;
  /** 商品説明（段落ごとの配列） */
  description: string[];
  /** 味・特徴 */
  features: string[];
  /** おすすめの食べ方 */
  eatingSuggestions: string[];
  /** ご注意（アレルギー・取り扱い等） */
  cautions: string[];

  images: ProductImage[];

  /**
   * 公式オンラインショップ（BASE）の該当商品ページ。
   * checkoutConfig.provider が "external" のとき、この商品の
   * ご購入手続きの引き継ぎ先として使う。null ならショップTOPへ。
   */
  externalUrl: string | null;

  /** Googleショッピング用: 商品の状態 */
  condition: "new";
  /** Googleショッピング用: JANコード等。未取得なら null */
  gtin: string | null;
  /** 関連商品として出す商品の slug */
  relatedSlugs: string[];
};

/* ================================================================
   カテゴリー
================================================================ */

export const productCategories: ProductCategory[] = [
  {
    id: "lychee",
    name: "ライチ",
    description: "旬のあいだだけ収穫できる、指宿・山川の生ライチ。",
  },
  {
    id: "tropical-fruit",
    name: "熱帯果樹の実",
    description: "ライチのほかに山川園芸で育てている南国の果実。",
  },
  {
    id: "seedling",
    name: "苗木",
    description: "ご自宅で育ててみたい方へ。熱帯果樹の苗木。",
  },
  {
    id: "seasonal",
    name: "季節の商品",
    description: "その時期だけの商品。",
  },
  {
    id: "other",
    name: "その他",
    description: "",
  },
];

/* ================================================================
   育てている品種 [確認済]
   ---------------------------------------------------------------
   収穫の時期によって品種が変わる。
   品種のご指定は受けていないため、「〇〇をお届けします」とは書かない。
   ここに1行足せば、商品ページ・ライチについてのページの両方に反映される。
================================================================ */

export const lycheeVarieties: Array<{ period: string; names: string[] }> = [
  { period: "7月ごろ", names: ["三月紅", "在来種（佐多、黒葉）"] },
  {
    period: "8月ごろ",
    names: ["宮崎ライチと呼ばれる種", "桂味", "ノーマイチー"],
  },
];

/** 品種の指定について（画面と構造化データで同じ文言を使う） */
export const varietyNote =
  "品種を指定してのご購入はお受けしておりません。その時期に採れたもののなかから、いちばん良い状態のものをお届けします。";

/* ================================================================
   商品
================================================================ */

export const products: Product[] = [
  {
    id: "lychee-fresh-500g",
    slug: "nama-lychee-500g",
    name: "生ライチ 500g",
    shortName: "生ライチ 500g",
    category: "lychee",

    // [公式] 公式オンラインショップの掲載価格（税込）。
    // 今季の価格が変わる場合はここを書き換えるだけでよい。
    price: 2500,
    taxIncluded: true,
    priceNote: "表示価格は税込です。送料は別途かかります。",

    volume: "500g", // [公式]
    countGuide: "約12〜13粒", // [公式]

    // ★販売状況はここで切り替える★
    // "in_stock" | "preorder" | "sold_out" | "coming_soon" | "draft"
    availability: "in_stock",
    maxQuantity: 10,

    saleStart: null, // [TODO] 今季の販売開始日
    saleEnd: null, // [TODO] 今季の販売終了日

    // [確認済] お届けできるのは7月上旬からお盆ごろまで
    shippingSchedule: "7月上旬からお盆ごろまでのお届けです。",
    // [確認済] ヤマト運輸のクール便のみで配送
    shippingMethod: "ヤマト運輸のクール便でお届けします。",

    origin: siteConfig.origin,

    // [公式] 商品ページの保存方法の記載にもとづく
    storage:
      "冷蔵庫で約1週間を目安にお召し上がりください。乾燥すると果皮の色が変わりやすいため、ジッパー付きの袋などに入れて保存してください。",

    // [確認済] ジッパー付きの袋のほか、店頭販売と同じ包装にも対応
    packaging: siteConfig.packagingNote,
    showVarieties: true,

    lead: "薩摩半島のいちばん南、指宿・山川で育った生のライチです。",

    description: [
      "国内で穫れる生のライチは、旬がごく短い果物です。木の上で色づいた実を収穫し、農園から直接お送りします。",
      "冷凍のライチとは香りも食感も別のもの。皮をむいた瞬間に立ちのぼる香りと、あふれるような果汁が生ライチのいちばんの持ち味です。",
      "そのままお召し上がりいただくほか、凍らせてスムージーやデザートにしても楽しめます。",
      "収穫の時期によって品種が変わります。7月は三月紅や在来種、8月は桂味やノーマイチーなど。その時期にいちばん良い状態のものをお届けします。",
    ],

    features: [
      "皮をむくと香りが立つ、生ならではの香気",
      "みずみずしく、果汁の多い果肉",
      "薩摩半島最南端・指宿山川の風のなかで育った実",
    ],

    eatingSuggestions: [
      "冷蔵庫で冷やして、そのまま",
      "凍らせてシャーベットのように",
      "スムージーやデザートの材料に",
    ],

    cautions: [
      "ひと粒ずつ大きさに差があります。粒数ではなく重量（g）を基準としています。",
      varietyNote,
      "種があります。小さなお子様やご高齢の方がお召し上がりの際は、誤って飲み込まないようご注意ください。",
      "生鮮食品です。お届け後はお早めにお召し上がりください。",
      siteConfig.giftWrapping.note,
    ],

    images: [
      {
        // 1枚目が一覧・カート・SNSシェアで使われる「顔」になる
        src: "/images/products/lychee-tray.jpg",
        alt: "トレイに並べた収穫したての生ライチ",
        slot: "products/lychee-tray.jpg",
      },
      {
        src: "/images/lychee/lychee-closeup.jpg",
        alt: "生ライチの果皮のアップ",
        slot: "lychee/lychee-closeup.jpg",
      },
      {
        src: "/images/lychee/lychee-on-tree.jpg",
        alt: "木になっているライチの実",
        slot: "lychee/lychee-on-tree.jpg",
      },
      {
        src: "/images/lychee/lychee-in-hand.jpg",
        alt: "手に持ったライチ一粒",
        slot: "lychee/lychee-in-hand.jpg",
      },
      // [TODO] 皮をむいた果肉の写真がまだありません。
      // 「生ライチはどんな中身なのか」がいちばん伝わる1枚なので、
      // 撮れたら public/images/lychee/lychee-peeled.jpg に置き、
      // ここに { src, alt, slot } を1件追加してください。
    ],

    externalUrl: null, // [TODO] BASEの該当商品ページURLが分かれば入れる（未設定ならショップTOPへ）

    condition: "new",
    gtin: null,
    relatedSlugs: ["nama-lychee-350g"],
  },

  /* ──────────────────────────────────────────────
     生ライチ 350g
     500gより少ない、はじめての方向けの量。
  ────────────────────────────────────────────── */
  {
    id: "lychee-fresh-350g",
    slug: "nama-lychee-350g",
    name: "生ライチ 350g",
    shortName: "生ライチ 350g",
    category: "lychee",

    price: 1800, // [確認済] 税込
    taxIncluded: true,
    priceNote: "表示価格は税込です。送料は別途かかります。",

    volume: "350g",
    // [TODO] 個数の目安が分かれば入れる（500gは約12〜13粒）。
    // 推測では書かないため、確認が取れるまで空にしている。
    countGuide: null,

    // ★販売状況はここで切り替える★
    availability: "in_stock",
    maxQuantity: 10,

    saleStart: null,
    saleEnd: null,

    shippingSchedule: "7月上旬からお盆ごろまでのお届けです。",
    shippingMethod: "ヤマト運輸のクール便でお届けします。",

    origin: siteConfig.origin,

    storage:
      "冷蔵庫で約1週間を目安にお召し上がりください。乾燥すると果皮の色が変わりやすいため、ジッパー付きの袋などに入れて保存してください。",

    packaging: siteConfig.packagingNote,
    showVarieties: true,

    lead: "まずは少しだけ試してみたい方に。指宿・山川の生ライチ、350gです。",

    description: [
      "500gより少なめの、ご家庭でちょうど使いきりやすい量です。生のライチを初めて召し上がる方にも。",
      "冷凍のライチとは香りも食感も別のもの。皮をむいた瞬間に立ちのぼる香りと、あふれるような果汁が生ライチのいちばんの持ち味です。",
      "収穫の時期によって品種が変わります。7月は三月紅や在来種、8月は桂味やノーマイチーなど。その時期にいちばん良い状態のものをお届けします。",
    ],

    features: [
      "皮をむくと香りが立つ、生ならではの香気",
      "みずみずしく、果汁の多い果肉",
      "薩摩半島最南端・指宿山川の風のなかで育った実",
    ],

    eatingSuggestions: [
      "冷蔵庫で冷やして、そのまま",
      "凍らせてシャーベットのように",
      "スムージーやデザートの材料に",
    ],

    cautions: [
      "ひと粒ずつ大きさに差があります。粒数ではなく重量（g）を基準としています。",
      varietyNote,
      "種があります。小さなお子様やご高齢の方がお召し上がりの際は、誤って飲み込まないようご注意ください。",
      "生鮮食品です。お届け後はお早めにお召し上がりください。",
      siteConfig.giftWrapping.note,
    ],

    images: [
      {
        src: "/images/products/lychee-tray.jpg",
        alt: "トレイに並べた収穫したての生ライチ",
        slot: "products/lychee-tray.jpg",
      },
      {
        src: "/images/lychee/lychee-closeup.jpg",
        alt: "生ライチの果皮のアップ",
        slot: "lychee/lychee-closeup.jpg",
      },
      {
        src: "/images/lychee/lychee-in-hand.jpg",
        alt: "手に持ったライチ一粒",
        slot: "lychee/lychee-in-hand.jpg",
      },
    ],

    externalUrl: null,

    condition: "new",
    gtin: null,
    relatedSlugs: ["nama-lychee-500g"],
  },
];

/* ================================================================
   参照ヘルパー
================================================================ */

/** 一覧に出す商品（draft は除外） */
export const visibleProducts = products.filter(
  (product) => product.availability !== "draft",
);

/** slug から商品を引く */
export function getProduct(slug: string): Product | undefined {
  return visibleProducts.find((product) => product.slug === slug);
}

/** カテゴリー内の商品 */
export function getProductsByCategory(category: ProductCategoryId): Product[] {
  return visibleProducts.filter((product) => product.category === category);
}

/** 実際に商品が1件以上あるカテゴリーだけを返す */
export function getActiveCategories(): ProductCategory[] {
  return productCategories.filter((category) =>
    visibleProducts.some((product) => product.category === category.id),
  );
}

/** 関連商品（未設定なら同カテゴリーの他の商品で補う） */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const explicit = product.relatedSlugs
    .map((slug) => getProduct(slug))
    .filter((item): item is Product => Boolean(item));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const fallback = visibleProducts.filter(
    (item) =>
      item.slug !== product.slug &&
      item.category === product.category &&
      !explicit.some((existing) => existing.slug === item.slug),
  );

  return [...explicit, ...fallback].slice(0, limit);
}

/** カートに入れられる状態か */
export function isBuyable(product: Product): boolean {
  return (
    (product.availability === "in_stock" ||
      product.availability === "preorder") &&
    product.price !== null
  );
}

/** 販売状況の表示ラベル */
export const availabilityLabel: Record<ProductAvailability, string> = {
  in_stock: "販売中",
  preorder: "予約受付中",
  sold_out: "売り切れ",
  coming_soon: "販売準備中",
  draft: "非公開",
};

/** schema.org の ItemAvailability に対応させる */
export const availabilitySchema: Record<ProductAvailability, string> = {
  in_stock: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  sold_out: "https://schema.org/SoldOut",
  coming_soon: "https://schema.org/PreOrder",
  draft: "https://schema.org/OutOfStock",
};

/** Googleショッピング（Merchant Center）の availability 値 */
export const availabilityFeedValue: Record<ProductAvailability, string> = {
  in_stock: "in_stock",
  preorder: "preorder",
  sold_out: "out_of_stock",
  coming_soon: "preorder",
  draft: "out_of_stock",
};
