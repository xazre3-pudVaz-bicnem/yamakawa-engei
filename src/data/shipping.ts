/**
 * 送料の設定
 *
 * ─────────────────────────────────────────────
 * 山川園芸の配送条件（確認済）
 * ─────────────────────────────────────────────
 * ・350g・500g とも、すべて60サイズで発送する
 * ・すべてクロネコヤマトのクール宅急便
 * ・発送元は鹿児島県指宿市（ヤマトの地帯区分では「九州」発）
 * ・1個口にまとめられる分はまとめて発送する
 *   （商品点数＝個口数ではない。下の「梱包」の節を参照）
 *
 * したがって送料は次の式で決まる。
 *
 *   （九州発・60サイズの宅急便運賃 ＋ クール宅急便60サイズの追加料金）
 *   × 必要な個口数
 *
 * ★商品点数ではなく個口数を掛ける★
 *   例: 500g×1 ＋ 350g×2 は商品3点だが1個口なので、送料は1個口分。
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

import { packItems, type PackedParcel, type PackItem } from "@/lib/packing";

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

/** 荷姿 */
export const PARCEL = {
  size: "60サイズ",
  service: "クロネコヤマト クール宅急便",
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
   梱包（何個口になるか）
================================================================ */

/**
 * 山川園芸から伺った梱包条件 [確認済]
 *
 *   350gの商品は、同じ商品3個まで1個口
 *   500gの商品は、同じ商品2個まで1個口
 *   500g×2 ＋ 350g×1 → 2個口
 *   500g×1 ＋ 350g×2 → 1個口
 *
 * この表は「事実の記録」であって、計算には直接使わない。
 * 下の PARCEL_CAPACITY_GRAMS による計算がこの表をすべて再現できるかを
 * 起動時に検証し、1件でも合わなければ決済を止める
 * （isPackingModelConsistent → canCheckout）。
 *
 * 新しい条件を伺ったら、ここに1行足すこと。
 * 計算と食い違えば、その場で気づける。
 */
export type ConfirmedPacking = {
  composition: Array<{ weightGrams: number; quantity: number }>;
  parcels: number;
};

export const CONFIRMED_PACKINGS: ConfirmedPacking[] = [
  { composition: [{ weightGrams: 350, quantity: 1 }], parcels: 1 },
  { composition: [{ weightGrams: 350, quantity: 2 }], parcels: 1 },
  { composition: [{ weightGrams: 350, quantity: 3 }], parcels: 1 },
  { composition: [{ weightGrams: 500, quantity: 1 }], parcels: 1 },
  { composition: [{ weightGrams: 500, quantity: 2 }], parcels: 1 },
  {
    composition: [
      { weightGrams: 500, quantity: 2 },
      { weightGrams: 350, quantity: 1 },
    ],
    parcels: 2,
  },
  {
    composition: [
      { weightGrams: 500, quantity: 1 },
      { weightGrams: 350, quantity: 2 },
    ],
    parcels: 1,
  },
];

/**
 * 1個口に入れられる商品重量の上限（g）
 *
 * ★山川園芸への正式確認はまだ取れていない★ [TODO]
 *
 * ただし、思いつきの数字ではない。
 * 上の CONFIRMED_PACKINGS から、上限は次の範囲に挟まれる。
 *
 *   500g×1 ＋ 350g×2 ＝ 1,200g が1個口  → 上限は 1,200g 以上
 *   500g×2 ＋ 350g×1 ＝ 1,350g が2個口  → 上限は 1,350g 未満
 *
 * そして 350g・500g をどう組み合わせても、
 * 1,200g より重く 1,350g より軽い重量は作れない。
 * つまり、この範囲のどの値を使っても個口数は変わらない。
 * その検証は scripts/check-shipping.ts が毎回（ビルド前にも）行っている。
 *
 * 正式に上限が確認できたら
 *   1. この値を確認できた数値に置き換える
 *   2. CAPACITY_CONFIRMED を true にする
 *   3. npm run check:shipping を流して個口数が変わらないか確かめる
 * 範囲の外の値だった場合は個口数が変わるので、必ず3を行うこと。
 */
export const PARCEL_CAPACITY_GRAMS = 1200;

/** 上限重量の正式確認が取れているか [TODO] 山川園芸に確認 */
export const CAPACITY_CONFIRMED = false;

/**
 * 確認済みの条件から導かれる上限重量の範囲。
 * scripts/check-shipping.ts が、この範囲の値ならどれを使っても
 * 個口数が変わらないことを検証している。
 */
export const CAPACITY_RANGE = { min: 1200, maxExclusive: 1350 } as const;

/**
 * 計算モデルが、確認済みの梱包条件をすべて再現できているか。
 * 1件でも食い違えば false になり、決済が止まる。
 */
export const isPackingModelConsistent: boolean = CONFIRMED_PACKINGS.every(
  (confirmed) => {
    const items: PackItem[] = confirmed.composition.flatMap(
      ({ weightGrams, quantity }) =>
        Array.from({ length: quantity }, () => ({
          label: `${weightGrams}g`,
          weightGrams,
        })),
    );
    const packed = packItems(items, PARCEL_CAPACITY_GRAMS);
    return packed.ok && packed.count === confirmed.parcels;
  },
);

/** 個口数を計算するための入力。価格は使わない */
export type ShippingLine = {
  /** 内訳の表示に使う商品名 */
  name: string;
  /** 商品1点の重量（g）。null なら計算できない */
  weightGrams: number | null;
  quantity: number;
};

export type ParcelPlan =
  | {
      ok: true;
      /** 必要な個口数 */
      parcels: number;
      /** 商品の総重量（g） */
      totalWeightGrams: number;
      /** 個口ごとの内訳 */
      breakdown: PackedParcel[];
    }
  | { ok: false; reason: string };

/**
 * カートの中身から、必要な個口数を計算する。
 *
 * ★送料に使うときは必ずサーバー側で呼ぶこと★
 * 画面表示のために同じ関数をブラウザ側でも使うが、
 * その結果は表示専用で、請求額には一切使わない。
 */
export function planParcels(lines: ShippingLine[]): ParcelPlan {
  if (!isPackingModelConsistent) {
    return {
      ok: false,
      reason:
        "ただいま配送の設定を確認しております。お手数ですが、お問い合わせよりご注文ください。",
    };
  }

  const items: PackItem[] = [];

  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      return { ok: false, reason: "ご注文の数量を確認できませんでした。" };
    }
    if (line.weightGrams === null || !Number.isFinite(line.weightGrams)) {
      return {
        ok: false,
        reason: `「${line.name}」の配送方法を確認しております。お手数ですが、お問い合わせよりご注文ください。`,
      };
    }
    for (let i = 0; i < line.quantity; i++) {
      items.push({ label: line.name, weightGrams: line.weightGrams });
    }
  }

  const packed = packItems(items, PARCEL_CAPACITY_GRAMS);

  if (!packed.ok) {
    switch (packed.reason) {
      case "empty":
        return { ok: false, reason: "カートに商品が入っていません。" };
      case "too-many":
        return {
          ok: false,
          reason:
            "ご注文の点数が多いため、この画面ではお受けできません。お手数ですが、お問い合わせよりご相談ください。",
        };
      default:
        return {
          ok: false,
          reason:
            "配送方法を確認できませんでした。お手数ですが、お問い合わせよりご相談ください。",
        };
    }
  }

  return {
    ok: true,
    parcels: packed.count,
    totalWeightGrams: packed.totalWeightGrams,
    breakdown: packed.parcels,
  };
}

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
      /** 必要な個口数（商品点数ではない） */
      parcels: number;
      /** 商品の総重量（g） */
      totalWeightGrams: number;
      /** 個口ごとの内訳 */
      breakdown: PackedParcel[];
      /** 1個口あたりの送料（税込） */
      unitRate: number;
      /** 送料の合計（税込）＝ 1個口あたり × 個口数 */
      amount: number;
      /** Stripeの決済画面に出す名前 */
      label: string;
    }
  | { ok: false; reason: string };

/**
 * 送料を計算する。
 *
 * ★必ずサーバー側でだけ呼ぶこと★
 * クライアントから送られてきた送料額・個口数は一切信用しない。
 * 個口数はここで、商品の重量から計算し直す。
 *
 * @param prefecture お届け先の都道府県（Stripeが収集した住所の state）
 * @param lines カートの中身（商品名・1点あたりの重量・数量）
 * @param addressParts 市区町村・番地など。離島の判定に使う
 */
export function quoteShipping(
  prefecture: string | null | undefined,
  lines: ShippingLine[],
  addressParts: Array<string | null | undefined> = [],
): ShippingQuote {
  const plan = planParcels(lines);
  if (!plan.ok) {
    return { ok: false, reason: plan.reason };
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
  const parcels = plan.parcels;

  return {
    ok: true,
    region,
    parcels,
    totalWeightGrams: plan.totalWeightGrams,
    breakdown: plan.breakdown,
    unitRate,
    // ★商品点数ではなく個口数を掛ける★
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
    "すべて60サイズのクール宅急便でお送りします。1個口にまとめられる分はまとめてお送りし、送料は個口数の分だけいただきます。",

  /**
   * 梱包のご案内（画面に出す説明）
   * 数字は CONFIRMED_PACKINGS と合わせること。
   */
  packing:
    "1個口に入るのは、350gなら3点まで、500gなら2点までが目安です。500g×1点と350g×2点のように、組み合わせても1個口に収まる場合があります。入りきらない分は個口数が増え、その分の送料がかかります。",
};

/** 梱包の説明に使う例（画面表示用。CONFIRMED_PACKINGS と同じ内容） */
export const PACKING_EXAMPLES: Array<{ order: string; parcels: number }> = [
  { order: "350g × 3点", parcels: 1 },
  { order: "500g × 2点", parcels: 1 },
  { order: "500g × 1点 ＋ 350g × 2点", parcels: 1 },
  { order: "500g × 2点 ＋ 350g × 1点", parcels: 2 },
];

/**
 * 送料の金額を画面に出せる状態か。
 * 料金表を持っているので通常は true。
 * 料金表に欠けがある場合だけ false になり、そのとき決済は止まる。
 */
export const isShippingConfigured: boolean =
  PREFECTURE_COUNT === 47 &&
  REGIONS.every((region) => Number.isFinite(YAMATO_60_FROM_KYUSHU[region.id]));

/**
 * 決済に進んでよいか。
 * 料金表がそろっていて、かつ梱包の計算が
 * 確認済みの条件をすべて再現できているときだけ true。
 */
export const canCheckout: boolean =
  isShippingConfigured && isPackingModelConsistent;

/** 送料を出せない理由（管理者向けのログ用） */
export const shippingBlockReason: string | null = canCheckout
  ? null
  : !isShippingConfigured
    ? "src/data/shipping.ts の料金表または都道府県の対応表に漏れがあります。"
    : "src/data/shipping.ts の梱包の計算が CONFIRMED_PACKINGS を再現できていません。PARCEL_CAPACITY_GRAMS を確認してください。";
