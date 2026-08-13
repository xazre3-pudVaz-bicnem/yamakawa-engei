/**
 * 送料計算の確認スクリプト
 *
 * 実行: npx tsx scripts/check-shipping.ts
 *
 * 料金表を直したときは、これを流して意図した金額になっているか確かめること。
 * 期待値と合わなければ、終了コード1で落ちる。
 */

import {
  PREFECTURE_COUNT,
  RATE_TABLE,
  REGIONS,
  findRegionByPrefecture,
  quoteShipping,
} from "../src/data/shipping";

let failed = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${label}  実際=${String(actual)} 期待=${String(expected)}`,
  );
}

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/* ================================================================
   1. 都道府県の対応表
================================================================ */
console.log("■ 都道府県の対応表");
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
   2. 料金表（1個口あたり＝宅急便運賃＋クール料金275円）
================================================================ */
console.log("\n■ 1個口あたりの送料（税込）");
for (const region of RATE_TABLE) {
  console.log(
    `  ${region.name.padEnd(4, "　")} ${yen(region.total).padStart(8)}  （運賃 ${yen(region.base)} ＋ クール ${yen(region.cool)}）`,
  );
}

/* ================================================================
   3. 指定された6パターン
================================================================ */
console.log("\n■ 6パターンの送料（数量1点＝1個口）");

const CASES: Array<{ pref: string; region: string; unit: number }> = [
  { pref: "東京都", region: "関東", unit: 1460 + 275 },
  { pref: "大阪府", region: "関西", unit: 1060 + 275 },
  { pref: "福岡県", region: "九州", unit: 940 + 275 },
  { pref: "鹿児島県", region: "九州", unit: 940 + 275 },
  { pref: "北海道", region: "北海道", unit: 2340 + 275 },
  { pref: "沖縄県", region: "沖縄", unit: 1320 + 275 },
];

for (const testCase of CASES) {
  const quote = quoteShipping(testCase.pref, 1);
  if (!quote.ok) {
    console.log(`  NG  ${testCase.pref}: ${quote.reason}`);
    failed++;
    continue;
  }
  const ok =
    quote.region.name === testCase.region && quote.amount === testCase.unit;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${testCase.pref.padEnd(5, "　")} → ${quote.region.name.padEnd(4, "　")} ${yen(quote.amount).padStart(8)}  期待=${yen(testCase.unit)}`,
  );
}

/* ================================================================
   4. 数量が増えると個口数分の送料になるか
================================================================ */
console.log("\n■ 数量1・2・3での個口数と送料");

for (const testCase of CASES) {
  const parts: string[] = [];
  let allOk = true;
  for (const quantity of [1, 2, 3]) {
    const quote = quoteShipping(testCase.pref, quantity);
    if (!quote.ok) {
      allOk = false;
      parts.push(`${quantity}点=エラー`);
      continue;
    }
    const expected = testCase.unit * quantity;
    if (quote.amount !== expected || quote.parcels !== quantity) allOk = false;
    parts.push(`${quantity}点(${quote.parcels}個口)=${yen(quote.amount)}`);
  }
  if (!allOk) failed++;
  console.log(`  ${allOk ? "OK " : "NG "} ${testCase.pref.padEnd(5, "　")} ${parts.join("  ")}`);
}

/* ================================================================
   5. 指定例：500g×2 + 350g×1 = 3個口
================================================================ */
console.log("\n■ ご指定の例（500g×2 ＋ 350g×1 = 3個口）");
{
  const totalQuantity = 2 + 1;
  const quote = quoteShipping("東京都", totalQuantity);
  if (quote.ok) {
    check("個口数", quote.parcels, 3);
    check("送料", quote.amount, (1460 + 275) * 3);
    console.log(`      表示名: ${quote.label}`);
  } else {
    console.log(`  NG  ${quote.reason}`);
    failed++;
  }
}

/* ================================================================
   6. 異常な入力
================================================================ */
console.log("\n■ 異常な入力");

const badCases: Array<{ label: string; pref: string; qty: number }> = [
  { label: "数量0", pref: "東京都", qty: 0 },
  { label: "負の数量", pref: "東京都", qty: -1 },
  { label: "小数の数量", pref: "東京都", qty: 1.5 },
  { label: "都道府県が空", pref: "", qty: 1 },
  { label: "存在しない都道府県", pref: "架空県", qty: 1 },
];

for (const bad of badCases) {
  const quote = quoteShipping(bad.pref, bad.qty);
  const ok = !quote.ok;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${bad.label} → ${quote.ok ? `通ってしまった（${quote.amount}円）` : "拒否"}`,
  );
}

/* ================================================================
   7. 略称の都道府県名
================================================================ */
console.log("\n■ 「東京」のような略称でも地域を引けるか");
for (const [input, expected] of [
  ["東京", "関東"],
  ["大阪", "関西"],
  ["北海道", "北海道"],
  ["沖縄", "沖縄"],
] as const) {
  const region = findRegionByPrefecture(input);
  check(`${input}`, region?.name, expected);
}

/* ================================================================
   8. クール便を扱えない地域
================================================================ */
console.log("\n■ クール便を取り扱えない地域（お断りできるか）");
for (const [pref, city] of [
  ["東京都", "新島村式根島"],
  ["東京都", "利島村"],
  ["東京都", "御蔵島村"],
  ["東京都", "青ヶ島村"],
  ["東京都", "小笠原村父島"],
] as const) {
  const quote = quoteShipping(pref, 1, [city]);
  const ok = !quote.ok;
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "NG "} ${pref}${city} → ${quote.ok ? "通ってしまった" : "お断り"}`);
}

// 本土の東京都はきちんと通ること（誤検出していないか）
{
  const quote = quoteShipping("東京都", 1, ["渋谷区", "神南1-1-1"]);
  check("東京都渋谷区は通る", quote.ok, true);
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
