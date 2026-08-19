/**
 * 送料・梱包の確認スクリプト
 *
 * 実行: npm run check:shipping
 * npm run build の前にも自動で走る（package.json の prebuild）。
 * 1件でも期待どおりでなければ終了コード1で落ち、ビルドが止まる。
 *
 * 料金表・梱包条件・商品の重量を直したときは、必ずこれを通すこと。
 */

import {
  CAPACITY_RANGE,
  CONFIRMED_PACKINGS,
  PARCEL_CAPACITY_GRAMS,
  PREFECTURE_COUNT,
  RATE_TABLE,
  REGIONS,
  canCheckout,
  findRegionByPrefecture,
  isPackingModelConsistent,
  planParcels,
  quoteShipping,
  ratePerParcel,
  type ShippingLine,
} from "../src/data/shipping";
import { packItems } from "../src/lib/packing";
import {
  decodeOrderItems,
  encodeOrderItems,
  validateOrder,
} from "../src/lib/order";
import { getProduct } from "../src/data/products";
import { isPurchasable } from "../src/data/siteConfig";

let failed = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${label}  実際=${String(actual)} 期待=${String(expected)}`,
  );
}

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 全角を2文字ぶんとして数えた表示幅 */
const width = (s: string) =>
  [...s].reduce(
    (sum, char) => sum + (/[ -~｡-ﾟ]/.test(char) ? 1 : 2),
    0,
  );

/** 表示幅をそろえる（列がずれないように） */
const pad = (s: string, columns: number) =>
  s + " ".repeat(Math.max(0, columns - width(s)));

/** 商品のslug（重量はここではなく products.ts から引く） */
const SLUG_500 = "nama-lychee-500g";
const SLUG_350 = "nama-lychee-350g";

/* ================================================================
   0. 設定が壊れていないか
================================================================ */
console.log("■ 設定の健全性");
check("梱包の計算が確認済み条件を再現できている", isPackingModelConsistent, true);
check("決済に進める状態", canCheckout, true);
check("500gの重量がある", getProduct(SLUG_500)?.weightGrams, 500);
check("350gの重量がある", getProduct(SLUG_350)?.weightGrams, 350);

/* ================================================================
   1. 都道府県の対応表
================================================================ */
console.log("\n■ 都道府県の対応表");
check("都道府県の数", PREFECTURE_COUNT, 47);

const seen = new Set<string>();
let duplicated = 0;
for (const region of REGIONS) {
  for (const pref of region.prefectures) {
    if (seen.has(pref)) duplicated++;
    seen.add(pref);
  }
}
check("重複した都道府県", duplicated, 0);
check("地域の数", REGIONS.length, 12);

/* ================================================================
   2. 料金表（1個口あたり＝宅急便運賃＋クール料金）
================================================================ */
console.log("\n■ 1個口あたりの送料（税込）");
for (const region of RATE_TABLE) {
  console.log(
    `  ${pad(region.name, 8)} ${yen(region.total).padStart(8)}  （運賃 ${yen(region.base)} ＋ クール ${yen(region.cool)}）`,
  );
}

/* ================================================================
   3. 山川園芸から伺った梱包条件を再現できているか
================================================================ */
console.log("\n■ 確認済みの梱包条件との突き合わせ");
for (const confirmed of CONFIRMED_PACKINGS) {
  const label = confirmed.composition
    .map((c) => `${c.weightGrams}g×${c.quantity}`)
    .join(" ＋ ");
  const items = confirmed.composition.flatMap(({ weightGrams, quantity }) =>
    Array.from({ length: quantity }, () => ({
      label: `${weightGrams}g`,
      weightGrams,
    })),
  );
  const packed = packItems(items, PARCEL_CAPACITY_GRAMS);
  const actual = packed.ok ? packed.count : -1;
  const ok = actual === confirmed.parcels;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${pad(label, 26)} → ${actual}個口  確認済み=${confirmed.parcels}個口`,
  );
}

/* ================================================================
   4. 上限重量が範囲内のどの値でも結果が変わらないか
   ---------------------------------------------------------------
   上限は「1,200g以上・1,350g未満」までしか確認できていない。
   その範囲のどの値を使っても個口数が変わらないなら、
   1,200g を使って差し支えない、と言える。
   ここが崩れたら（商品の重量を増やしたときなど）必ず失敗する。
================================================================ */
console.log("\n■ 上限重量の不確かさ（1,200g以上1,350g未満）の影響");
{
  const weights = [350, 500];
  let mismatched = 0;
  let compared = 0;

  for (let a = 0; a <= 6; a++) {
    for (let b = 0; b <= 6; b++) {
      if (a + b === 0) continue;
      const items = [
        ...Array.from({ length: a }, () => ({ label: "350g", weightGrams: weights[0] })),
        ...Array.from({ length: b }, () => ({ label: "500g", weightGrams: weights[1] })),
      ];
      const baseline = packItems(items, CAPACITY_RANGE.min);
      if (!baseline.ok) {
        mismatched++;
        continue;
      }
      for (
        let capacity = CAPACITY_RANGE.min;
        capacity < CAPACITY_RANGE.maxExclusive;
        capacity++
      ) {
        const packed = packItems(items, capacity);
        compared++;
        if (!packed.ok || packed.count !== baseline.count) {
          mismatched++;
          console.log(
            `  NG  350g×${a} ＋ 500g×${b}: 上限${capacity}g で ${packed.ok ? packed.count : "計算不可"}個口（1,200gでは${baseline.count}個口）`,
          );
        }
      }
    }
  }

  check(`結果が変わった組み合わせ（${compared}通りを検証）`, mismatched, 0);
  console.log(
    `      → 範囲内のどの上限でも個口数は同じ。${PARCEL_CAPACITY_GRAMS}g を使って問題ない。`,
  );
}

/* ================================================================
   5. ご指定の組み合わせ
   ---------------------------------------------------------------
   商品重量・必要個口数・送料・Stripeへ渡す送料 が一致するかを見る。
   「Stripeへ渡す送料」は、実際のAPIと同じ経路
   （metadataに保存 → metadataから復元 → 送料計算）をたどって求めている。
   送料の計算は販売中かどうかとは関係なく成り立つべきものなので、
   在庫の関門（validateOrder）は通していない。
   売り切れの商品を注文できないことは、別の節で確かめている。
================================================================ */
console.log("\n■ ご指定の組み合わせ（お届け先＝東京都）");

type Combo = { label: string; order: Array<{ slug: string; quantity: number }> };

const COMBOS: Combo[] = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    label: `350g×${n}`,
    order: [{ slug: SLUG_350, quantity: n }],
  })),
  ...[1, 2, 3, 4].map((n) => ({
    label: `500g×${n}`,
    order: [{ slug: SLUG_500, quantity: n }],
  })),
  {
    label: "500g×1 ＋ 350g×1",
    order: [
      { slug: SLUG_500, quantity: 1 },
      { slug: SLUG_350, quantity: 1 },
    ],
  },
  {
    label: "500g×1 ＋ 350g×2",
    order: [
      { slug: SLUG_500, quantity: 1 },
      { slug: SLUG_350, quantity: 2 },
    ],
  },
  {
    label: "500g×2 ＋ 350g×1",
    order: [
      { slug: SLUG_500, quantity: 2 },
      { slug: SLUG_350, quantity: 1 },
    ],
  },
  {
    label: "500g×2 ＋ 350g×2",
    order: [
      { slug: SLUG_500, quantity: 2 },
      { slug: SLUG_350, quantity: 2 },
    ],
  },
  {
    label: "500g×3 ＋ 350g×1",
    order: [
      { slug: SLUG_500, quantity: 3 },
      { slug: SLUG_350, quantity: 1 },
    ],
  },
];

/** 期待値。重量から手で数えた個口数 */
const EXPECTED: Record<string, { grams: number; parcels: number }> = {
  "350g×1": { grams: 350, parcels: 1 },
  "350g×2": { grams: 700, parcels: 1 },
  "350g×3": { grams: 1050, parcels: 1 },
  "350g×4": { grams: 1400, parcels: 2 },
  "350g×5": { grams: 1750, parcels: 2 },
  "350g×6": { grams: 2100, parcels: 2 },
  "500g×1": { grams: 500, parcels: 1 },
  "500g×2": { grams: 1000, parcels: 1 },
  "500g×3": { grams: 1500, parcels: 2 },
  "500g×4": { grams: 2000, parcels: 2 },
  "500g×1 ＋ 350g×1": { grams: 850, parcels: 1 },
  "500g×1 ＋ 350g×2": { grams: 1200, parcels: 1 },
  "500g×2 ＋ 350g×1": { grams: 1350, parcels: 2 },
  "500g×2 ＋ 350g×2": { grams: 1700, parcels: 2 },
  "500g×3 ＋ 350g×1": { grams: 1850, parcels: 2 },
};

const PREF = "東京都";
const UNIT_RATE = ratePerParcel("kanto"); // 関東の1個口あたり

console.log(
  `  ${pad("ご注文", 27)}${pad("重量", 8)}${pad("点数", 7)}${pad("個口", 8)}${pad("送料", 10)}Stripeへ`,
);
console.log("  " + "─".repeat(35));

for (const combo of COMBOS) {
  const expected = EXPECTED[combo.label];

  /* --- (a) 商品データから直接 --- */
  const lines: ShippingLine[] = combo.order.map(({ slug, quantity }) => {
    const product = getProduct(slug)!;
    return { name: product.name, weightGrams: product.weightGrams, quantity };
  });
  const plan = planParcels(lines);

  /* --- (b) 実際のAPIと同じ経路 --- */
  // 1. Checkout Session の metadata に入れる文字列にする
  const metadata = encodeOrderItems(
    combo.order.map(({ slug, quantity }) => {
      const product = getProduct(slug)!;
      return { product, quantity, lineTotal: (product.price ?? 0) * quantity };
    }),
  );
  // 2. 送料計算のときに metadata から復元する（ブラウザの値は使わない）
  const restored = decodeOrderItems(metadata);
  if (!restored) {
    console.log(`  NG  ${combo.label}: metadata を復元できない（${metadata}）`);
    failed++;
    continue;
  }
  // 3. Stripeへ渡す送料
  const quote = quoteShipping(PREF, restored, ["渋谷区", "神南1-1-1"]);

  if (!plan.ok || !quote.ok) {
    console.log(
      `  NG  ${combo.label}: 計算できない（${!plan.ok ? plan.reason : !quote.ok ? quote.reason : ""}）`,
    );
    failed++;
    continue;
  }

  const totalQuantity = combo.order.reduce((sum, o) => sum + o.quantity, 0);
  const expectedAmount = UNIT_RATE * expected.parcels;

  const ok =
    plan.totalWeightGrams === expected.grams &&
    quote.totalWeightGrams === expected.grams &&
    plan.parcels === expected.parcels &&
    quote.parcels === expected.parcels &&
    quote.amount === expectedAmount &&
    quote.amount === UNIT_RATE * quote.parcels;
  if (!ok) failed++;

  console.log(
    `  ${ok ? "OK " : "NG "}${pad(combo.label, 24)}${`${quote.totalWeightGrams}g`.padStart(6)}  ${pad(`${totalQuantity}点`, 5)}  ${pad(`${quote.parcels}個口`, 6)}${yen(expectedAmount).padStart(8)}  ${yen(quote.amount).padStart(8)}`,
  );

  if (!ok) {
    console.log(
      `        期待: ${expected.grams}g / ${expected.parcels}個口 / ${yen(expectedAmount)}`,
    );
  }
}

/* ================================================================
   6. 送料 ＝ 1個口あたり × 個口数（商品点数ではない）
================================================================ */
console.log("\n■ 送料が「商品点数」ではなく「個口数」で決まっているか");
{
  // 商品3点だが1個口 → 1個口分の送料
  const oneParcel = quoteShipping(PREF, [
    { name: "生ライチ 500g", weightGrams: 500, quantity: 1 },
    { name: "生ライチ 350g", weightGrams: 350, quantity: 2 },
  ]);
  // 商品3点で2個口 → 2個口分の送料
  const twoParcels = quoteShipping(PREF, [
    { name: "生ライチ 500g", weightGrams: 500, quantity: 2 },
    { name: "生ライチ 350g", weightGrams: 350, quantity: 1 },
  ]);

  if (oneParcel.ok && twoParcels.ok) {
    check("500g×1＋350g×2（3点）の個口数", oneParcel.parcels, 1);
    check("500g×1＋350g×2（3点）の送料", oneParcel.amount, UNIT_RATE);
    check("500g×2＋350g×1（3点）の個口数", twoParcels.parcels, 2);
    check("500g×2＋350g×1（3点）の送料", twoParcels.amount, UNIT_RATE * 2);
    console.log(`      表示名: ${twoParcels.label}`);
  } else {
    console.log("  NG  計算できませんでした");
    failed++;
  }
}

/* ================================================================
   7. 地域ごとの送料（1個口・2個口）
================================================================ */
console.log("\n■ 6つの都道府県での送料");

const PREF_CASES: Array<{ pref: string; region: string; unit: number }> = [
  { pref: "東京都", region: "関東", unit: 1460 + 275 },
  { pref: "大阪府", region: "関西", unit: 1060 + 275 },
  { pref: "福岡県", region: "九州", unit: 940 + 275 },
  { pref: "鹿児島県", region: "九州", unit: 940 + 275 },
  { pref: "北海道", region: "北海道", unit: 2340 + 275 },
  { pref: "沖縄県", region: "沖縄", unit: 1320 + 275 },
];

// 1個口になる注文と、2個口になる注文
const ONE: ShippingLine[] = [
  { name: "生ライチ 500g", weightGrams: 500, quantity: 2 },
];
const TWO: ShippingLine[] = [
  { name: "生ライチ 500g", weightGrams: 500, quantity: 2 },
  { name: "生ライチ 350g", weightGrams: 350, quantity: 1 },
];

for (const testCase of PREF_CASES) {
  const one = quoteShipping(testCase.pref, ONE);
  const two = quoteShipping(testCase.pref, TWO);
  const ok =
    one.ok &&
    two.ok &&
    one.region.name === testCase.region &&
    one.parcels === 1 &&
    one.amount === testCase.unit &&
    two.parcels === 2 &&
    two.amount === testCase.unit * 2;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${pad(testCase.pref, 10)} → ${pad(testCase.region, 8)} 1個口=${yen(testCase.unit).padStart(8)}  2個口=${yen(testCase.unit * 2).padStart(8)}`,
  );
}

/* ================================================================
   8. 異常な入力
================================================================ */
console.log("\n■ 異常な入力");

const badCases: Array<{ label: string; pref: string; lines: ShippingLine[] }> = [
  {
    label: "数量0",
    pref: PREF,
    lines: [{ name: "生ライチ 500g", weightGrams: 500, quantity: 0 }],
  },
  {
    label: "負の数量",
    pref: PREF,
    lines: [{ name: "生ライチ 500g", weightGrams: 500, quantity: -1 }],
  },
  {
    label: "小数の数量",
    pref: PREF,
    lines: [{ name: "生ライチ 500g", weightGrams: 500, quantity: 1.5 }],
  },
  {
    label: "重量が未設定",
    pref: PREF,
    lines: [{ name: "重さ未確認の商品", weightGrams: null, quantity: 1 }],
  },
  {
    label: "上限を超える重さの商品",
    pref: PREF,
    lines: [{ name: "重すぎる商品", weightGrams: 5000, quantity: 1 }],
  },
  { label: "カートが空", pref: PREF, lines: [] },
  {
    label: "都道府県が空",
    pref: "",
    lines: [{ name: "生ライチ 500g", weightGrams: 500, quantity: 1 }],
  },
  {
    label: "存在しない都道府県",
    pref: "架空県",
    lines: [{ name: "生ライチ 500g", weightGrams: 500, quantity: 1 }],
  },
];

for (const bad of badCases) {
  const quote = quoteShipping(bad.pref, bad.lines);
  const ok = !quote.ok;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${pad(bad.label, 26)} → ${quote.ok ? `通ってしまった（${yen(quote.amount)}）` : "拒否"}`,
  );
}

/* ================================================================
   9. metadata を書き換えられても壊れないか
================================================================ */
console.log("\n■ metadata の復元");
for (const raw of [
  "",
  "存在しない商品:1",
  `${SLUG_500}:0`,
  `${SLUG_500}:abc`,
  `${SLUG_500}:-2`,
]) {
  const restored = decodeOrderItems(raw);
  const ok = restored === null;
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "NG "} "${raw}" → ${ok ? "拒否" : "通ってしまった"}`);
}
{
  const restored = decodeOrderItems(`${SLUG_500}:2,${SLUG_350}:1`);
  check("正しい文字列の復元", restored?.length, 2);
  check("復元した重量（500g）", restored?.[0].weightGrams, 500);
  check("復元した重量（350g）", restored?.[1].weightGrams, 350);
}

/* ================================================================
   9-2. ブラウザから送られた値を使っていないか
   ---------------------------------------------------------------
   価格・重量・個口数・送料をリクエストに混ぜても、
   結果が変わらないことを確かめる。
================================================================ */
console.log("\n■ 販売状況の反映");
{
  // 販売終了中は、たとえリクエストを直接叩かれても注文を通さない
  const order = validateOrder({ lines: [{ slug: SLUG_500, quantity: 1 }] });
  const selling = isPurchasable;

  if (selling) {
    const ok = order.ok;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "OK " : "NG "} 販売中のため注文を受け付ける → ${order.ok ? "受付" : order.message}`,
    );
  } else {
    const ok = !order.ok;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "OK " : "NG "} 販売終了中のため注文を受け付けない → ${order.ok ? "通ってしまった" : order.message}`,
    );
  }
}

console.log("\n■ ブラウザから送られた値を無視しているか");
{
  // ブラウザが重量1g・価格1円・個口数1・送料0円と申告してきても、
  // metadata に入るのは slug と数量だけなので、復元した時点で申告値は残らない。
  const restored = decodeOrderItems(`${SLUG_500}:3,${SLUG_350}:1`)!;
  const quote = quoteShipping(PREF, restored);

  // 500g×3 ＋ 350g×1 ＝ 1,850g → 2個口
  check("復元した重量（500g）", restored[0].weightGrams, 500);
  check("復元した重量（350g）", restored[1].weightGrams, 350);
  check("総重量", quote.ok && quote.totalWeightGrams, 1850);
  check("個口数", quote.ok && quote.parcels, 2);
  check("送料", quote.ok && quote.amount, UNIT_RATE * 2);

  // 価格もサーバー側の商品データから引く
  const subtotal =
    (getProduct(SLUG_500)!.price ?? 0) * 3 + (getProduct(SLUG_350)!.price ?? 0);
  check("商品の小計", subtotal, 2500 * 3 + 1800);
}

/* ================================================================
   10. 略称の都道府県名
================================================================ */
console.log("\n■ 「東京」のような略称でも地域を引けるか");
for (const [input, expected] of [
  ["東京", "関東"],
  ["大阪", "関西"],
  ["北海道", "北海道"],
  ["沖縄", "沖縄"],
] as const) {
  check(`${input}`, findRegionByPrefecture(input)?.name, expected);
}

/* ================================================================
   11. クール便を扱えない地域
================================================================ */
console.log("\n■ クール便を取り扱えない地域（お断りできるか）");
for (const [pref, city] of [
  ["東京都", "新島村式根島"],
  ["東京都", "利島村"],
  ["東京都", "御蔵島村"],
  ["東京都", "青ヶ島村"],
  ["東京都", "小笠原村父島"],
] as const) {
  const quote = quoteShipping(pref, ONE, [city]);
  const ok = !quote.ok;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${pref}${city} → ${quote.ok ? "通ってしまった" : "お断り"}`,
  );
}
{
  const quote = quoteShipping("東京都", ONE, ["渋谷区", "神南1-1-1"]);
  check("東京都渋谷区は通る", quote.ok, true);
}

/* ================================================================
   12. 最大数量でも計算が終わるか
================================================================ */
console.log("\n■ 最大数量（500g×10 ＋ 350g×10）");
{
  const startedAt = process.hrtime.bigint();
  const quote = quoteShipping(PREF, [
    { name: "生ライチ 500g", weightGrams: 500, quantity: 10 },
    { name: "生ライチ 350g", weightGrams: 350, quantity: 10 },
  ]);
  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

  if (quote.ok) {
    console.log(
      `  OK  ${quote.totalWeightGrams}g → ${quote.parcels}個口  ${yen(quote.amount)}  （${elapsedMs.toFixed(1)}ms）`,
    );
    check("送料＝1個口あたり×個口数", quote.amount, UNIT_RATE * quote.parcels);
    check("個口ごとの内訳の数", quote.breakdown.length, quote.parcels);
    const overloaded = quote.breakdown.filter(
      (parcel) => parcel.weightGrams > PARCEL_CAPACITY_GRAMS,
    ).length;
    check("上限を超えた個口", overloaded, 0);
    if (elapsedMs > 1000) {
      console.log(`  NG  計算に時間がかかりすぎています（${elapsedMs.toFixed(0)}ms）`);
      failed++;
    }
  } else {
    console.log(`  NG  ${quote.reason}`);
    failed++;
  }
}

/* ================================================================
   結果
================================================================ */
console.log("");
if (failed > 0) {
  console.error(`✗ ${failed}件が期待どおりではありません。`);
  process.exit(1);
}
console.log("✓ すべて期待どおりです。");
