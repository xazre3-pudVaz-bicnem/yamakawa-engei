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
   NEXT_PUBLIC_SITE_URL が未設定のあいだは
   canonical / OGP / sitemap.xml を出力せず、robots.txt は
   全ページ Disallow になる。プレビューURLが誤ってインデックス
   されるのを構造的に防ぐための仕組み。
   本番ドメインが決まったら Vercel の環境変数に設定すること。
   例: NEXT_PUBLIC_SITE_URL=https://yamakawaengei.jp
================================================================ */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/** 本番URL（末尾スラッシュなし）。未設定なら null */
export const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : null;

/** 本番ドメインが設定済みか（SEO出力のスイッチ） */
export const isPublicSite = siteUrl !== null;

/** metadataBase 用。未設定時はローカルにフォールバック */
export const metadataBaseUrl = new URL(siteUrl ?? "http://localhost:3000");

/** 絶対URLを組み立てる（未設定時は相対パスのまま返す） */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return siteUrl ? `${siteUrl}${normalized === "/" ? "" : normalized}` : normalized;
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

  /** 公式Instagram [確認済] */
  instagram: {
    url: "https://www.instagram.com/azisaibiyori/",
    handle: "@azisaibiyori",
    /** プロフィール文 [公式] */
    bio: "指宿のライチ屋さんです",
  },

  /**
   * 公式オンラインショップ（BASE）[公式]
   *
   * 現在、実際にご注文を受け付けている販売チャネル。
   * 本サイトのカートは checkout.provider = "external" のとき
   * 最終的にここへ引き継ぐ。Stripe接続後は provider を切り替える。
   */
  externalShop: {
    name: "山川園芸 公式オンラインショップ",
    platform: "BASE",
    url: "https://yamaen.base.shop",
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
  phase: "coming_soon" as SalesPhase,

  /**
   * [TODO] 今季の販売開始日・終了日が決まったら入力。
   * 例: "2026-06-25"。未定のあいだは null のままでよい。
   */
  saleStartDate: null as string | null,
  saleEndDate: null as string | null,

  /**
   * 旬の時期の目安。
   * 国内のライチは6月下旬〜7月ごろが収穫期にあたる一般的な情報にもとづく表記。
   * [TODO] 山川園芸の今季の実際の収穫時期が分かったら、より具体的な表記に更新する。
   */
  seasonLabel: "6月下旬〜7月ごろ",
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
    body: "指宿のライチは6月下旬から7月ごろが旬。販売の開始は公式Instagramと本サイトでお知らせします。",
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
   [TODO] 送料は未確定。fee を null にしているあいだ、
   カート・商品ページには金額を表示せず「別途」と案内する。
================================================================ */

export const shippingConfig = {
  /**
   * 送料。[TODO] 未確定のため null。
   * 全国一律なら { type: "flat", fee: 1000 } のように設定する。
   * 地域別なら type を "by_region" にして regions に金額を入れる。
   */
  type: "unconfirmed" as "unconfirmed" | "flat" | "by_region" | "free",
  /** 全国一律送料（税込）。未確定なら null */
  flatFee: null as number | null,
  /** 地域別送料。未確定なら空配列 */
  regions: [] as Array<{ name: string; fee: number }>,
  /** 送料無料になる購入金額。未設定なら null */
  freeShippingThreshold: null as number | null,

  /**
   * 配送温度帯。[TODO] 未確認。
   * 公式ショップの商品説明に「コールドチェーンでの管理」への言及があるが、
   * 冷蔵便か冷凍便かの明記がないため、ここでは断定しない。
   */
  temperature: null as string | null,

  /** 配送会社。[TODO] 未確認 */
  carrier: null as string | null,

  /** 発送までの目安 [公式・BASEショップの商品ページ表記] */
  dispatchLead: "ご注文から2〜3営業日以内に発送",

  /** 発送日指定の可否。[TODO] 未確認 */
  canSpecifyDeliveryDate: null as boolean | null,

  /** 配送可能地域。[TODO] 未確認（離島・一部地域の可否を要確認） */
  deliverableArea: null as string | null,

  /** 共通注記 */
  note: "収穫の状況や天候により、発送が前後する場合があります。",
};

/* ================================================================
   決済
   ---------------------------------------------------------------
   provider を切り替えるだけで /checkout の挙動が変わる。
     "external" … カート内容を確認後、公式オンラインショップ（BASE）へ引き継ぐ
     "stripe"   … Stripe Checkout へ（要 STRIPE_SECRET_KEY。/api/checkout を実装）
     "inquiry"  … ご注文フォーム（メール）で受け付ける
   APIキーは必ず環境変数から読むこと。コードに直接書かない。
================================================================ */

export const checkoutConfig = {
  /** ★ここを書き換える★ */
  provider: "external" as "external" | "stripe" | "inquiry",

  /**
   * 支払方法。現在は公式オンラインショップ（BASE）での取り扱い内容 [公式]。
   * 自社決済（Stripe）に切り替える際は、実際に有効化した手段だけを残すこと。
   */
  paymentMethods: [
    "クレジットカード",
    "PAY ID あと払い（コンビニ・銀行）",
    "銀行振込",
  ],

  /** 支払時期 [公式] */
  paymentTiming:
    "クレジットカードは注文時、銀行振込・あと払いは各サービスの定める期日までにお支払いください。",

  /** 引渡し時期 [公式] */
  deliveryTiming: "ご入金の確認後、5日以内に発送いたします。",

  /** 返品・キャンセル [公式] */
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
   [TODO] 公開できるメールアドレスが未確認のため、現在は
   電話・Instagram・公式オンラインショップの問い合わせフォームを案内している。
   email に値を入れると、お問い合わせページにメールの導線が追加される。
================================================================ */

export const contactConfig = {
  /** 公開してよいメールアドレス。未確認なら null */
  email: null as string | null,

  /**
   * 自社フォームを設置する場合の送信先。
   * 例: "/api/contact" を実装し、Resend や SendGrid 等でメール送信する。
   * 値を入れるまではフォームを表示せず、確実に届く連絡手段だけを案内する。
   */
  formEndpoint: null as string | null,

  /** 公式オンラインショップ（BASE）の問い合わせフォーム [公式] */
  shopContactUrl: "https://yamaen.base.shop/inquiry",
};

/* ================================================================
   ナビゲーション
================================================================ */

/** ヘッダーの主要導線 */
export const navigation = [
  { href: "/shop", label: "オンラインショップ", labelEn: "Shop" },
  { href: "/lychee", label: "ライチについて", labelEn: "Lychee" },
  { href: "/how-to-eat", label: "食べ方・保存", labelEn: "How to eat" },
  { href: "/about", label: "山川園芸について", labelEn: "About" },
  { href: "/access", label: "農園・アクセス", labelEn: "Access" },
] as const;

/** フッターのリンク群 */
export const footerNavigation = [
  {
    title: "商品",
    links: [
      { href: "/shop", label: "オンラインショップ" },
      { href: "/products/nama-lychee-500g", label: "生ライチ 500g" },
      { href: "/cart", label: "カート" },
    ],
  },
  {
    title: "ライチを知る",
    links: [
      { href: "/lychee", label: "ライチについて" },
      { href: "/how-to-eat", label: "食べ方・保存方法" },
      { href: "/column", label: "コラム" },
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
