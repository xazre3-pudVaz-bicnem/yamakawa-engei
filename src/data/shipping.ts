/**
 * 送料の設定
 *
 * ─────────────────────────────────────────────
 * ★ ここを設定しないと決済できません ★
 * ─────────────────────────────────────────────
 * mode が "unconfirmed" のあいだ、Stripeの決済画面は開きません。
 * 送料が決まっていない状態で注文を受けると、
 * 送料分がまるごと赤字になるためです。
 *
 * 送料が決まったら、下の SHIPPING を書き換えてください。
 * それだけで、カート・購入手続き・配送ページ・特商法の表示と、
 * Stripeに渡す送料がすべて一致します。
 *
 * ─────────────────────────────────────────────
 * 設定のしかた
 * ─────────────────────────────────────────────
 * ■ 全国一律にする場合
 *     mode: "flat",
 *     flatFee: 1200,            // 税込
 *
 * ■ 地域別にする場合
 *     mode: "by_region",
 *     regions の各 fee に税込金額を入れる（null のままにしない）
 *
 * ■ 送料無料にする場合
 *     mode: "free",
 *
 * ■ 一定額以上で送料無料にする場合
 *     上記に加えて freeShippingThreshold: 10000 のように設定
 *
 * ─────────────────────────────────────────────
 * 地域別を選んだときの注意
 * ─────────────────────────────────────────────
 * Stripeの決済画面は、お客様が入力した住所から送料を自動で選ぶ仕組みを
 * 持っていません。地域別にすると、お客様自身が地域を選ぶ形になります。
 * そのため、選ばれた地域とお届け先の住所が食い違う可能性があります。
 *
 * これに対しては、Webhook（api/stripe/webhook）で
 * 「選ばれた送料の地域」と「実際のお届け先の都道府県」を突き合わせ、
 * ずれていればログに警告を出すようにしています。
 * 運用が煩雑になるため、可能であれば全国一律をおすすめします。
 */

export type ShippingMode = "unconfirmed" | "flat" | "by_region" | "free";

export type ShippingRegion = {
  id: string;
  /** お客様に見せる地域名 */
  name: string;
  /** この地域に含まれる都道府県（住所との突き合わせに使う） */
  prefectures: string[];
  /** 送料（税込）。未設定なら null */
  fee: number | null;
};

/**
 * 地域の区分
 * ヤマト運輸のクール便を想定した一般的な区分です。
 * 実際の料金表に合わせて、区分ごと変えていただいてかまいません。
 */
const REGIONS: ShippingRegion[] = [
  { id: "hokkaido", name: "北海道", prefectures: ["北海道"], fee: null },
  {
    id: "tohoku",
    name: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    fee: null,
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
    fee: null,
  },
  {
    id: "shinetsu-hokuriku",
    name: "信越・北陸",
    prefectures: ["新潟県", "長野県", "富山県", "石川県", "福井県"],
    fee: null,
  },
  {
    id: "tokai",
    name: "東海",
    prefectures: ["静岡県", "愛知県", "岐阜県", "三重県"],
    fee: null,
  },
  {
    id: "kinki",
    name: "近畿",
    prefectures: [
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
    ],
    fee: null,
  },
  {
    id: "chugoku",
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    fee: null,
  },
  {
    id: "shikoku",
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
    fee: null,
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
    fee: null,
  },
  { id: "okinawa", name: "沖縄", prefectures: ["沖縄県"], fee: null },
];

export const SHIPPING = {
  /** ★ ここを書き換える ★ */
  mode: "unconfirmed" as ShippingMode,

  /** 全国一律のときの送料（税込）。mode が "flat" のときだけ使う */
  flatFee: null as number | null,

  /** 地域別のときの送料。mode が "by_region" のときだけ使う */
  regions: REGIONS,

  /** この金額以上で送料無料。設定しない場合は null */
  freeShippingThreshold: null as number | null,

  /** 配送方法 [確認済] */
  carrier: "ヤマト運輸のクール便",

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
};

/* ================================================================
   参照ヘルパー
================================================================ */

/** 画面に送料の金額を出せる状態か */
export const isShippingConfigured: boolean =
  SHIPPING.mode === "free" ||
  (SHIPPING.mode === "flat" && SHIPPING.flatFee !== null) ||
  (SHIPPING.mode === "by_region" &&
    SHIPPING.regions.length > 0 &&
    SHIPPING.regions.every((region) => region.fee !== null));

/**
 * 決済に進んでよいか。
 * 送料が決まっていないうちは、Stripeのセッションを作らせない。
 */
export const canCheckout: boolean = isShippingConfigured;

/** 送料が未確定である理由（管理者向けのログ用） */
export const shippingBlockReason: string | null = canCheckout
  ? null
  : SHIPPING.mode === "unconfirmed"
    ? "src/data/shipping.ts の SHIPPING.mode が \"unconfirmed\" のままです。"
    : SHIPPING.mode === "flat"
      ? "SHIPPING.mode が \"flat\" ですが flatFee が未設定です。"
      : "SHIPPING.mode が \"by_region\" ですが、fee が未設定の地域があります。";

/** 都道府県から地域を引く（Webhookでの突き合わせに使う） */
export function findRegionByPrefecture(
  prefecture: string,
): ShippingRegion | undefined {
  const normalized = prefecture.trim();
  return SHIPPING.regions.find((region) =>
    region.prefectures.some(
      (pref) => pref === normalized || pref.replace(/[都道府県]$/, "") === normalized,
    ),
  );
}

/**
 * Stripe に渡す送料の選択肢を組み立てる。
 *
 * 送料が未確定のときは空配列を返す（呼び出し側で決済を止めている）。
 * 金額は必ずこの関数を通し、画面表示と食い違わないようにする。
 */
export function buildShippingOptions(subtotal: number): Array<{
  /** 画面に出る名前 */
  label: string;
  /** 税込金額（円） */
  amount: number;
  /** 地域別のときの地域ID。全国一律・無料のときは null */
  regionId: string | null;
}> {
  // 一定額以上で送料無料
  if (
    SHIPPING.freeShippingThreshold !== null &&
    subtotal >= SHIPPING.freeShippingThreshold
  ) {
    return [{ label: "送料無料", amount: 0, regionId: null }];
  }

  if (SHIPPING.mode === "free") {
    return [{ label: "送料無料", amount: 0, regionId: null }];
  }

  if (SHIPPING.mode === "flat" && SHIPPING.flatFee !== null) {
    return [
      {
        label: `${SHIPPING.carrier}（全国一律）`,
        amount: SHIPPING.flatFee,
        regionId: null,
      },
    ];
  }

  if (SHIPPING.mode === "by_region") {
    return SHIPPING.regions
      .filter((region): region is ShippingRegion & { fee: number } =>
        region.fee !== null,
      )
      .map((region) => ({
        label: `${SHIPPING.carrier}／${region.name}`,
        amount: region.fee,
        regionId: region.id,
      }));
  }

  return [];
}
