/**
 * 送料の設定
 *
 * ─────────────────────────────────────────────
 * 山川園芸の配送条件（確認済）
 * ─────────────────────────────────────────────
 * ・350g・500g とも、すべて60サイズで発送する
 * ・商品1点につき1個口。複数購入の場合も1点ごとに1個口
 * ・すべてクロネコヤマトのクール宅急便
 * ・発送元は鹿児島県指宿市（ヤマトの地帯区分では「九州」発）
 *
 * したがって送料は次の式で決まる。
 *
 *   （九州発・60サイズの宅急便運賃 ＋ クール宅急便60サイズの追加料金）
 *   × カート内の商品総数量
 *
 * ─────────────────────────────────────────────
 * 料金が改定されたとき
 * ─────────────────────────────────────────────
 * このファイルの YAMATO_60_FROM_KYUSHU と COOL_SURCHARGE_60 の
 * 2箇所だけを直せば、画面表示・Stripeに渡す送料・配送ページの料金表が
 * すべて同時に更新される。ほかのファイルは触らなくてよい。
 *
 * 出典（改定時は必ず公式で確認すること）
 *   宅急便運賃一覧表  https://www.kuronekoyamato.co.jp/ytc/search/estimate/ichiran.html
 *   クール宅急便      https://www.kuronekoyamato.co.jp/ytc/customer/send/services/cool/
 */

/* ================================================================
   地域区分（ヤマト運輸の地帯区分）と47都道府県の対応
================================================================ */

export type RegionId =
  | "hokkaido"
  | "kita-tohoku"
  | "minami-tohoku"
  | "kanto"
  | "shinetsu"
  | "hokuriku"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export type Region = {
  id: RegionId;
  /** お客様に見せる地域名 */
  name: string;
  /** この地域に属する都道府県（正式名称） */
  prefectures: string[];
};

/**
 * 地域区分と都道府県の対応表
 * ヤマト運輸の地帯区分にそろえている。47都道府県すべてを漏れなく記載する。
 */
export const REGIONS: Region[] = [
  { id: "hokkaido", name: "北海道", prefectures: ["北海道"] },
  {
    id: "kita-tohoku",
    name: "北東北",
    prefectures: ["青森県", "秋田県", "岩手県"],
  },
  {
    id: "minami-tohoku",
    name: "南東北",
    prefectures: ["宮城県", "山形県", "福島県"],
  },
  {
    id: "kanto",
    name: "関東",
    prefectures: [
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
      "山梨県",
    ],
  },
  { id: "shinetsu", name: "信越", prefectures: ["新潟県", "長野県"] },
  {
    id: "hokuriku",
    name: "北陸",
    prefectures: ["富山県", "石川県", "福井県"],
  },
  {
    id: "chubu",
    name: "中部",
    prefectures: ["静岡県", "愛知県", "岐阜県", "三重県"],
  },
  {
    id: "kansai",
    name: "関西",
    prefectures: ["大阪府", "京都府", "滋賀県", "奈良県", "和歌山県", "兵庫県"],
  },
  {
    id: "chugoku",
    name: "中国",
    prefectures: ["岡山県", "広島県", "山口県", "鳥取県", "島根県"],
  },
  {
    id: "shikoku",
    name: "四国",
    prefectures: ["香川県", "徳島県", "愛媛県", "高知県"],
  },
  {
    id: "kyushu",
    name: "九州",
    prefectures: [
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
    ],
  },
  { id: "okinawa", name: "沖縄", prefectures: ["沖縄県"] },
];

/** 対応表に載っている都道府県の数。47でなければ設定漏れ */
export const PREFECTURE_COUNT = REGIONS.reduce(
  (sum, region) => sum + region.prefectures.length,
  0,
);

/* ================================================================
   料金表
================================================================ */

/**
 * 宅急便 60サイズ・九州発の運賃（税込・円）
 * 出典: ヤマト運輸「宅急便運賃一覧表」
 * 発送元の鹿児島県指宿市は「九州」発にあたる。
 */
const YAMATO_60_FROM_KYUSHU: Record<RegionId, number> = {
  hokkaido: 2340,
  "kita-tohoku": 1760,
  "minami-tohoku": 1760,
  kanto: 1460,
  shinetsu: 1460,
  hokuriku: 1190,
  chubu: 1190,
  kansai: 1060,
  chugoku: 940,
  shikoku: 1060,
  kyushu: 940,
  okinawa: 1320,
};

/**
 * クール宅急便 60サイズの追加料金（税込・円）
 * 出典: ヤマト運輸「クール宅急便」オプション料金
 */
const COOL_SURCHARGE_60 = 275;

/** 荷姿。商品1点につき1個口 */
export const PARCEL = {
  size: "60サイズ",
  service: "クロネコヤマト クール宅急便",
  /** 商品1点あたりの個口数 */
  parcelsPerItem: 1,
} as const;

/** 1個口あたりの送料（税込）。宅急便運賃＋クール料金 */
export function ratePerParcel(regionId: RegionId): number {
  return YAMATO_60_FROM_KYUSHU[regionId] + COOL_SURCHARGE_60;
}

/** 料金表（画面表示用）。内訳も持たせて、根拠が分かるようにする */
export const RATE_TABLE = REGIONS.map((region) => ({
  ...region,
  base: YAMATO_60_FROM_KYUSHU[region.id],
  cool: COOL_SURCHARGE_60,
  total: ratePerParcel(region.id),
}));

/* ================================================================
   クール宅急便を取り扱えない地域
================================================================ */

/**
 * クール宅急便が届けられない住所
 *
 * ヤマト運輸では離島の追加料金は原則ないが、
 * 一部の島はクール宅急便そのものを取り扱っていない。
 * 出典: ヤマト運輸「クール宅急便」
 *   伊豆諸島のうち 式根島・利島・御蔵島・青ヶ島、および小笠原村（小笠原諸島）
 *
 * 対応できない住所が増えたら、この配列に1行足すだけでよい。
 * 住所の文字列に keyword が含まれていたら、決済を止めて案内を出す。
 */
export const COOL_UNAVAILABLE_AREAS: Array<{
  /** 住所に含まれていたら対象とみなす文字列 */
  keyword: string;
  /** お客様への案内に使う地域名 */
  label: string;
}> = [
  { keyword: "式根島", label: "式根島" },
  { keyword: "利島", label: "利島" },
  { keyword: "御蔵島", label: "御蔵島" },
  { keyword: "青ヶ島", label: "青ヶ島" },
  { keyword: "青ケ島", label: "青ヶ島" },
  { keyword: "小笠原", label: "小笠原諸島" },
];

/* ================================================================
   参照ヘルパー
================================================================ */

/**
 * 都道府県名から地域を引く。
 * Stripeから届く値は「東京都」のような正式名称だが、
 * 「東京」のように末尾が欠けた形でも拾えるようにしている。
 */
export function findRegionByPrefecture(
  prefecture: string | null | undefined,
): Region | undefined {
  if (!prefecture) return undefined;
  const value = prefecture.trim();
  if (!value) return undefined;

  return REGIONS.find((region) =>
    region.prefectures.some(
      (pref) => pref === value || pref.replace(/[都道府県]$/, "") === value,
    ),
  );
}

/** 住所がクール宅急便の対象外かを判定する */
export function findUnavailableArea(
  addressParts: Array<string | null | undefined>,
): { keyword: string; label: string } | undefined {
  const joined = addressParts.filter(Boolean).join(" ");
  if (!joined) return undefined;
  return COOL_UNAVAILABLE_AREAS.find((area) => joined.includes(area.keyword));
}

export type ShippingQuote =
  | {
      ok: true;
      region: Region;
      /** 個口数（＝商品の総数量） */
      parcels: number;
      /** 1個口あたりの送料（税込） */
      unitRate: number;
      /** 送料の合計（税込） */
      amount: number;
      /** Stripeの決済画面に出す名前 */
      label: string;
    }
  | { ok: false; reason: string };

/**
 * 送料を計算する。
 *
 * ★必ずサーバー側でだけ呼ぶこと★
 * クライアントから送られてきた送料額は一切信用しない。
 *
 * @param prefecture お届け先の都道府県（Stripeが収集した住所の state）
 * @param totalQuantity カート内の商品の総数量（＝個口数）
 * @param addressParts 市区町村・番地など。離島の判定に使う
 */
export function quoteShipping(
  prefecture: string | null | undefined,
  totalQuantity: number,
  addressParts: Array<string | null | undefined> = [],
): ShippingQuote {
  if (!Number.isInteger(totalQuantity) || totalQuantity < 1) {
    return { ok: false, reason: "ご注文の数量を確認できませんでした。" };
  }

  const unavailable = findUnavailableArea([prefecture, ...addressParts]);
  if (unavailable) {
    return {
      ok: false,
      reason: `${unavailable.label}へは、クール便でのお届けを承っておりません。お手数ですが、お問い合わせよりご相談ください。`,
    };
  }

  const region = findRegionByPrefecture(prefecture);
  if (!region) {
    return {
      ok: false,
      reason:
        "お届け先の都道府県を確認できませんでした。住所をご確認のうえ、もう一度お試しください。",
    };
  }

  const unitRate = ratePerParcel(region.id);
  const parcels = totalQuantity * PARCEL.parcelsPerItem;

  return {
    ok: true,
    region,
    parcels,
    unitRate,
    amount: unitRate * parcels,
    label:
      parcels === 1
        ? `${PARCEL.service}（${PARCEL.size}／${region.name}）`
        : `${PARCEL.service}（${PARCEL.size}／${region.name}／${parcels}個口）`,
  };
}

/* ================================================================
   画面表示用の情報
================================================================ */

export const SHIPPING = {
  /** 配送方法 [確認済] */
  carrier: "クロネコヤマトのクール宅急便",

  /** 配送可能地域 [確認済] */
  deliverableArea: "離島を除く全国",

  /** 発送までの目安 [確認済] */
  dispatchLead: "ご注文から2〜3営業日以内に発送",

  /**
   * お届け日の指定。
   * 可否そのものは未確定のため、ご相談いただく案内にとどめている。
   */
  canSpecifyDeliveryDate: null as boolean | null,

  /** 共通の注記 */
  note: "収穫の状況や天候により、発送が前後する場合があります。",

  /** 送料の考え方（画面に出す説明） */
  policy:
    "すべて60サイズのクール宅急便でお送りします。商品1点につき1個口のため、2点ご注文の場合は2個口分の送料がかかります。",
};

/**
 * 送料の金額を画面に出せる状態か。
 * 料金表を持っているので通常は true。
 * 料金表に欠けがある場合だけ false になり、そのとき決済は止まる。
 */
export const isShippingConfigured: boolean =
  PREFECTURE_COUNT === 47 &&
  REGIONS.every((region) => Number.isFinite(YAMATO_60_FROM_KYUSHU[region.id]));

/** 決済に進んでよいか */
export const canCheckout: boolean = isShippingConfigured;

/** 送料を出せない理由（管理者向けのログ用） */
export const shippingBlockReason: string | null = canCheckout
  ? null
  : "src/data/shipping.ts の料金表または都道府県の対応表に漏れがあります。";
