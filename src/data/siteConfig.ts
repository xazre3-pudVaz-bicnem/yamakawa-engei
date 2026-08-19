/**
 * 山川園芸 サイト共通設定
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * 屋号・連絡先・販売状況・配送・決済など、サイト全体で使う情報を
 * ここ1箇所で管理する。各ページはこの値を参照するだけなので、
 * ここを書き換えれば全ページ・構造化データ・sitemap まで反映される。
 *
 * ─────────────────────────────────────────────
 * 記載ルール（重要）
 * ─────────────────────────────────────────────
 * - `null` / `""` は「未確認」を意味する。画面上では自動的に
 *   「確認中」「お問い合わせください」等の表記に置き換わり、
 *   構造化データからも除外される（＝誤情報を出さない）。
 * - 値の出典は各項目のコメントに残す。
 *   [確認済] … ご本人から提供された情報
 *   [公式]   … 公式Instagram / 公式オンラインショップ（BASE）の掲載内容
 *   [TODO]   … 未確認。要ヒアリング
 */

/* ================================================================
   本番URL
   ---------------------------------------------------------------
   canonical・OGP・sitemap.xml・構造化データ・商品フィードが
   すべてこの値を使う。ここが実際の公開ドメインと違うと、
   検索エンジンに別のURLを正規版として伝えてしまう。

   ドメインを変えたときは、下の PRODUCTION_URL を書き換えるだけでよい。
   一時的に別のURLで動かしたい場合だけ、環境変数
   NEXT_PUBLIC_SITE_URL を設定すると、そちらが優先される。

   ※ Vercelのプレビュー環境には Vercel 側で自動的に
     noindex が付くため、プレビューURLが検索結果に出ることはない。
================================================================ */

/**
 * 本番ドメイン [確認済]。末尾のスラッシュは付けない。
 *
 * ★ 必ず「実際に配信されているURL」と一致させること ★
 *
 * Vercel側では www.yamakawaengei.com が主ドメインになっており、
 * yamakawaengei.com（www なし）は www へ308で転送される。
 * ここを www なしにすると、canonical と sitemap が
 * 「転送されるURL」を指すことになり、Search Console で
 * 「ページにリダイレクトがあります」として弾かれる。
 *
 * www なしを正としたい場合は、先に Vercel の Domains 設定で
 * 主ドメインを yamakawaengei.com に切り替えてから、ここを直すこと。
 * 順番を逆にすると、一時的に不整合な canonical を配信してしまう。
 */
const PRODUCTION_URL = "https://www.yamakawaengei.com";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/** 本番URL（末尾スラッシュなし） */
export const siteUrl = (rawSiteUrl || PRODUCTION_URL).replace(/\/+$/, "");

/**
 * SEO関連の出力を行うか。
 * 何らかの理由で一時的にサイト全体を検索エンジンから隠したいときは、
 * ここを false にすると canonical・OGP・sitemap を出力せず、
 * robots.txt が全ページ Disallow になる。
 */
export const isPublicSite = true;

/** metadataBase 用 */
export const metadataBaseUrl = new URL(siteUrl);

/** 絶対URLを組み立てる */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
}

/* ================================================================
   基本情報
================================================================ */

export const siteConfig = {
  /** 屋号 [確認済] */
  name: "山川園芸",
  /** 読み（構造化データ・OGP用） */
  nameKana: "やまかわえんげい",
  /** 英字表記 */
  nameEn: "Yamakawa Engei",

  /** 代表者 [確認済] */
  owner: "泊 久美子",
  ownerKana: "とまり くみこ",

  /**
   * ブランドコンセプト
   * 公式オンラインショップの紹介文
   * 「薩摩半島の南端 指宿山川の風に育まれた大粒の宝石ともいえるピンク色の果実」
   * を土台にしている。[公式]
   */
  tagline: "指宿から、旬のライチを。",
  subTagline:
    "薩摩半島のいちばん南、指宿市山川。海からの風で育った熱帯果樹の実を、旬のあいだだけ農園から直接お届けします。",
  /** ライチ初心者への一言（サブコンセプト） */
  invitation: "ライチを知らなくても、きっと好きになる。",

  /** 所在地 [確認済] */
  address: {
    /**
     * 郵便番号
     * ご本人からの提供ではなく、住所をGoogleマップで検索した結果の値。
     * [TODO] 正式な表記をご確認のうえ、必要なら差し替えること。
     * （構造化データと特定商取引法の表記に使用）
     */
    postalCode: "891-0504",
    region: "鹿児島県",
    locality: "指宿市",
    street: "山川新生町101",
    full: "鹿児島県指宿市山川新生町101",
  },

  /** 電話 [確認済] */
  phone: "090-5029-2040",
  phoneHref: "tel:09050292040",
  /** 電話を受けられる時間の注記 */
  phoneNote: "8:00〜17:00（農作業中は出られないことがあります）",

  /**
   * 営業時間 [確認済]
   * dayOfWeek は schema.org の DayOfWeek 名に対応。
   */
  hours: [
    {
      label: "毎日",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  hoursSummary: "8:00〜17:00",
  /** 繁忙期の対応 [確認済] */
  busySeasonNote: "収穫の繁忙期は土日祝も対応しています。",

  /** [TODO] 定休日は未確認。公式ショップの表記は「不定休」[公式] */
  closedDays: "不定休",

  /**
   * 農園での直売・見学 [確認済]
   * 事前にご連絡いただければ対応。ライチ狩りの可否は未確定のため、
   * 「できます」とは書かず、あわせてご相談いただく案内にしている。
   */
  farmVisit: {
    available: true,
    note: "直売・見学は、事前にご連絡いただければ対応しています。ライチ狩りができるかどうかは時期によって変わりますので、あわせてお問い合わせください。",
  },

  /**
   * のし・ギフト包装 [確認済]
   * 対応していないため、ギフト訴求の箇所では必ずこの旨を明記する。
   */
  giftWrapping: {
    available: false,
    note: "のし・ギフト包装・メッセージカードには対応しておりません。",
  },

  /**
   * 包装 [確認済]
   * ジッパー付きの袋のほか、店頭販売と同じ包装にも対応。
   */
  packagingNote:
    "包装は、ジッパー付きの袋のほか、店頭販売と同じ包装にも対応しています。ご希望がありましたら、ご注文の際にお知らせください。",

  /** 公式Instagram [確認済] */
  instagram: {
    url: "https://www.instagram.com/azisaibiyori/",
    handle: "@azisaibiyori",
    /** プロフィール文 [公式] */
    bio: "指宿のライチ屋さんです",
  },

  /**
   * 店頭での取り扱い [公式・Instagramプロフィール]
   * 取扱状況は時期により変わるため、表示は「〜にて取り扱いいただいています」に留める。
   */
  retailPartners: [
    { name: "PICO（南さつま市）", note: "青果コーナーにてお取り扱いいただいています" },
  ],

  /** Googleマップ（住所検索リンク） */
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("鹿児島県指宿市山川新生町101"),

  /** Googleマップ埋め込み用URL */
  mapEmbedUrl:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("鹿児島県指宿市山川新生町101") +
    "&output=embed&z=16",

  /** 構造化データ用: 対応エリア */
  areaServed: ["日本全国"],

  /** 生産地表記（商品データのデフォルト） */
  origin: "鹿児島県指宿市山川",
};

/* ================================================================
   今年の販売状況
   ---------------------------------------------------------------
   phase を書き換えるだけで、TOPのお知らせ帯・ヒーローのCTA・
   ショップページの案内・スマホ下部の購入バーの文言がすべて変わる。
================================================================ */

export type SalesPhase =
  /** 販売中 */
  | "on_sale"
  /** 予約受付中 */
  | "preorder"
  /** 近日販売開始 */
  | "coming_soon"
  /** 今季販売終了 */
  | "closed";

export const salesStatus = {
  /**
   * ★ここを書き換える★
   * "on_sale" | "preorder" | "coming_soon" | "closed"
   */
  phase: "closed" as SalesPhase,

  /**
   * [TODO] 今季の販売開始日・終了日が決まったら入力。
   * 例: "2026-07-05"。未定のあいだは null のままでよい。
   */
  saleStartDate: null as string | null,
  saleEndDate: null as string | null,

  /**
   * 山川園芸のライチをお届けできる時期 [確認済]
   * サイト内で旬に触れる箇所は、すべてこの値を参照している。
   */
  seasonLabel: "7月上旬からお盆ごろ",
} as const;

/** 販売状況ごとの表示文言 */
export const salesPhaseCopy: Record<
  SalesPhase,
  {
    /** バッジ・帯に出す短いラベル */
    label: string;
    /** 見出し */
    heading: string;
    /** 本文 */
    body: string;
    /** 主CTAの文言 */
    ctaLabel: string;
    /** 主CTAのリンク先 */
    ctaHref: string;
  }
> = {
  on_sale: {
    label: "販売中",
    heading: "今年のライチ、販売中です。",
    // 配送の温度帯は未確認のため「冷蔵便」等とは書かない。
    body: "木で色づいた実を収穫し、農園から直接お送りしています。旬のあいだだけの果物です。",
    ctaLabel: "今年のライチを見る",
    ctaHref: "/shop",
  },
  preorder: {
    label: "予約受付中",
    heading: "今年のライチ、ご予約を受け付けています。",
    body: "収穫の状況を見ながら、順にお届けします。数に限りがあるため、お早めのご予約をおすすめします。",
    ctaLabel: "ご予約する",
    ctaHref: "/shop",
  },
  coming_soon: {
    label: "近日販売開始",
    heading: "今年のライチは、もうすぐです。",
    body: "山川園芸のライチをお届けできるのは7月上旬からお盆ごろまで。販売の開始は公式Instagramと本サイトでお知らせします。",
    ctaLabel: "商品を見る",
    ctaHref: "/shop",
  },
  closed: {
    label: "今季販売終了",
    heading: "今季のライチは販売を終了しました。",
    body: "たくさんのご注文をありがとうございました。次の収穫は来年の初夏です。再開のお知らせは公式Instagramでお伝えします。",
    ctaLabel: "ライチについて知る",
    ctaHref: "/lychee",
  },
};

/** 現在の販売状況の表示内容 */
export const currentSales = salesPhaseCopy[salesStatus.phase];

/** 販売状況が「買える状態」かどうか（カート導線の出し分けに使う） */
export const isPurchasable =
  salesStatus.phase === "on_sale" || salesStatus.phase === "preorder";

/* ================================================================
   配送・送料
   ---------------------------------------------------------------
   実体は src/data/shipping.ts にあります。
   ここでは、既存の import を壊さないために再輸出しているだけです。
   送料を設定するときは src/data/shipping.ts を開いてください。
================================================================ */

export { SHIPPING as shippingConfig, isShippingConfigured as hasShippingAmount } from "./shipping";

/* ================================================================
   決済（Stripe）
   ---------------------------------------------------------------
   本サイト内で完結する Stripe Embedded Checkout を使用。
   お客様はサイトから出ることなく、住所とカード情報を入力して決済できる。

   実装:
     /checkout                  … 決済フォーム（Embedded Checkout）
     /api/checkout              … Checkout Session の作成（金額はサーバーで確定）
     /api/stripe/webhook        … 注文確定の正式な受け口
     /order/complete            … 注文完了ページ

   APIキーは必ず環境変数から読むこと。コードに直接書かない。
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY … 公開鍵（ブラウザで使う）
     STRIPE_SECRET_KEY                  … 秘密鍵（サーバーのみ）
     STRIPE_WEBHOOK_SECRET              … Webhookの署名検証
================================================================ */

export const checkoutConfig = {
  /**
   * 支払方法。
   * ★ Stripeダッシュボードで実際に有効化しているものだけを書くこと ★
   * 有効化していない手段を書くと、特定商取引法の表記が事実と食い違う。
   *
   * コンビニ決済・銀行振込などを追加したときは、
   * ここに足したうえで、api/checkout の payment_method_types も見直すこと。
   */
  paymentMethods: ["クレジットカード（VISA／Mastercard／JCB／American Express など）"],

  /** 支払時期 */
  paymentTiming: "ご注文時にお支払いが完了します。",

  /** 引渡し時期 */
  deliveryTiming:
    "ご注文から2〜3営業日以内に発送いたします（収穫の状況により前後する場合があります）。",

  /** 返品・キャンセル */
  returnPolicy:
    "商品に欠陥がある場合を除き、原則として返品・交換はお受けしておりません。",

  /**
   * 生鮮品の品質対応。[TODO] 未確認。
   * 「傷み・輸送事故があった場合の連絡期限と対応」を必ず取り決めて記載すること。
   */
  freshnessPolicy: null as string | null,
};

/* ================================================================
   お問い合わせ
   ---------------------------------------------------------------
   電話・メール・Instagram・公式オンラインショップのフォームを案内している。
   email を null にすると、メールの導線だけが画面から消える。
================================================================ */

export const contactConfig = {
  /** 公開してよいメールアドレス [確認済] */
  email: "azisaibiyori@go5.enjoy.ne.jp" as string | null,

  /**
   * 自社フォームを設置する場合の送信先。
   * 例: "/api/contact" を実装し、Resend や SendGrid 等でメール送信する。
   * 値を入れるまではフォームを表示せず、確実に届く連絡手段だけを案内する。
   */
  formEndpoint: null as string | null,

  /**
   * [TODO] 自社の問い合わせフォームは未設置。
   * 設置したらここにパス（例: "/contact/form"）を入れる。
   * 現在は電話・メール・Instagramを案内している。
   */
  formUrl: null as string | null,
};

/* ================================================================
   ナビゲーション
================================================================ */

/**
 * ヘッダーの主要導線
 *
 * ライチの解説は /lychee（ライチ完全ガイド）が入口になっており、
 * 個別ページへはガイドの目次から進める。
 * ヘッダーにガイドの下層を並べると項目が増えすぎるため、ここには出さない。
 */
export const navigation = [
  { href: "/shop", label: "オンラインショップ", labelEn: "Shop" },
  { href: "/lychee", label: "ライチ完全ガイド", labelEn: "Lychee guide" },
  { href: "/about", label: "山川園芸について", labelEn: "About" },
  { href: "/access", label: "農園・アクセス", labelEn: "Access" },
] as const;

/** フッターのリンク群 */
export const footerNavigation = [
  {
    // オンラインショップ・カートへのリンクはオーナーのご指示により一旦削除。
    // 復活させる場合は、下に { href: "/shop", ... } を戻すだけでよい。
    title: "商品",
    links: [{ href: "/products/nama-lychee-500g", label: "生ライチ 500g" }],
  },
  {
    // SEOのためのリンク集にはしない。
    // 実際によく読まれる導線だけを、ガイドの目次への入口とあわせて置く。
    title: "ライチを知る",
    links: [
      { href: "/lychee", label: "ライチ完全ガイド" },
      { href: "/lychee/nutrition", label: "ライチの栄養" },
      { href: "/lychee/how-to-eat", label: "ライチの食べ方" },
      { href: "/lychee/season", label: "ライチの旬" },
      { href: "/lychee/storage", label: "ライチの保存方法" },
      { href: "/lychee/fresh", label: "生ライチとは" },
      { href: "/lychee/domestic", label: "国産ライチ" },
      { href: "/blog", label: "ブログ" },
    ],
  },
  {
    title: "山川園芸",
    links: [
      { href: "/about", label: "山川園芸について" },
      { href: "/access", label: "農園・アクセス" },
      { href: "/news", label: "お知らせ" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
  {
    title: "お買い物について",
    links: [
      { href: "/guide", label: "お買い物ガイド" },
      { href: "/shipping", label: "配送・送料について" },
      { href: "/faq", label: "よくある質問" },
      { href: "/legal", label: "特定商取引法に基づく表記" },
      { href: "/privacy", label: "プライバシーポリシー" },
    ],
  },
] as const;

/** 未確認情報の共通案内文 */
export const UNCONFIRMED_NOTE = "お手数ですが、お問い合わせよりご確認ください。";
