/**
 * 在庫の数え方の自動テスト
 *
 * Stripeにはつながず、確かめられるところだけを確かめる。
 *   ・補充の記録を Stripe の metadata に書けるか（キーの長さ）
 *   ・products.ts の stock の書き方が正しいか
 *   ・注文内容の文字列を、取りこぼしなく読み書きできるか
 *
 * 実際に数を数えるところ（Stripeへの問い合わせ）は、
 * つながらなければ null を返し、呼び出し側が「売らない」側に倒す。
 * つながらないまま売ってしまうことがない作りなので、ここでは試さない。
 */

import { products } from "../src/data/products";
import {
  addSessionsToCounts,
  amountKey,
  atKey,
  cleanNote,
  isSlugStorable,
  NOTE_MAX_LENGTH,
  noteKey,
  resolveRestock,
  stockManagedProducts,
} from "../src/lib/stock";
import type { Product } from "../src/data/products";
import { encodeOrderItems, parseOrderItems } from "../src/lib/order";

let failed = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(
    `  ${ok ? "OK " : "NG "} ${label}  実際=${JSON.stringify(actual)} 期待=${JSON.stringify(expected)}`,
  );
}

console.log("● 残りの数を数える商品");

const managed = stockManagedProducts();
console.log(`  対象: ${managed.length}件`);

for (const product of managed) {
  const stock = product.stock!;

  check(`${product.slug}: metadataのキーが40文字に収まる`, isSlugStorable(product.slug), true);
  console.log(`      ${amountKey(product.slug)} / ${atKey(product.slug)}`);

  check(
    `${product.slug}: ご用意する数が0以上の整数`,
    Number.isInteger(stock.initial) && stock.initial >= 0,
    true,
  );

  const since = new Date(stock.since);
  check(`${product.slug}: 数え始める日時が読める`, !Number.isNaN(since.getTime()), true);

  // 先の日付にすると、それ以降のご注文しか数えないため、
  // 売れていても残りが減らない
  check(`${product.slug}: 数え始める日時が未来でない`, since.getTime() <= Date.now(), true);

  // 残りより多く選べてしまうと、決済の直前で止めることになる。
  // 1回のご注文の上限は、ご用意する数までにそろえておく
  check(
    `${product.slug}: 1回のご注文の上限がご用意する数を超えない`,
    product.maxQuantity <= stock.initial,
    true,
  );

  // 送料を計算できない商品は、そもそも売れない
  check(
    `${product.slug}: 個口数を計算できる`,
    product.weightGrams !== null || product.maxPerParcel !== null,
    true,
  );
}

console.log("");
console.log("● 注文内容の読み書き");

{
  const line = (slug: string, quantity: number) => ({
    product: products.find((p) => p.slug === slug)!,
    quantity,
    lineTotal: 0,
  });

  const encoded = encodeOrderItems([
    line("dragon-fruit-350g", 2),
    line("ryugan-100g", 3),
  ]);
  check("書き出した形", encoded, "dragon-fruit-350g:2,ryugan-100g:3");
  check("読み戻した形", parseOrderItems(encoded), [
    { slug: "dragon-fruit-350g", quantity: 2 },
    { slug: "ryugan-100g", quantity: 3 },
  ]);
}

// 取り扱いをやめた商品が入っていても、数えられること。
// （過去のご注文を数え落とすと、残りの数が多く出てしまう）
check("取り扱いのない商品も数えられる", parseOrderItems("sold-out-item:4"), [
  { slug: "sold-out-item", quantity: 4 },
]);

check("空は読み取らない", parseOrderItems(""), null);
check("未設定は読み取らない", parseOrderItems(undefined), null);
check("数量がないものは読み取らない", parseOrderItems("dragon-fruit-350g"), null);
check("0点は読み取らない", parseOrderItems("dragon-fruit-350g:0"), null);
check("負の数は読み取らない", parseOrderItems("dragon-fruit-350g:-1"), null);
check("小数は読み取らない", parseOrderItems("dragon-fruit-350g:1.5"), null);
check("数字でないものは読み取らない", parseOrderItems("dragon-fruit-350g:abc"), null);
check(
  "1つでも読めなければ全体を読み取らない",
  parseOrderItems("dragon-fruit-350g:2,ryugan-100g:x"),
  null,
);

console.log("");
console.log("● どの補充の記録を使うか");

{
  // products.ts に書いた初期値
  const product = {
    slug: "test-item",
    stock: { initial: 5, since: "2026-10-01T00:00:00+09:00" },
  } as unknown as Product;

  const newer = "2026-10-03T00:00:00+09:00";
  const older = "2026-09-20T00:00:00+09:00";

  const amount = amountKey("test-item");
  const at = atKey("test-item");

  check("記録がなければ初期値を使う", resolveRestock(product, {}), {
    amount: 5,
    at: new Date("2026-10-01T00:00:00+09:00"),
    fromLedger: false,
    note: null,
  });

  check(
    "あとから補充した記録があれば、そちらを使う",
    resolveRestock(product, { [amount]: "8", [at]: newer }),
    { amount: 8, at: new Date(newer), fromLedger: true, note: null },
  );

  // 初期値を書き換えたときに、古い補充の記録に引きずられないこと
  check(
    "初期値より古い記録は使わない",
    resolveRestock(product, { [amount]: "8", [at]: older }),
    {
      amount: 5,
      at: new Date("2026-10-01T00:00:00+09:00"),
      fromLedger: false,
      note: null,
    },
  );

  // 0点＝売り切れにした記録。初期値に戻してしまうと、売り切れが解除される
  check(
    "0点にした記録もそのまま使う",
    resolveRestock(product, { [amount]: "0", [at]: newer }),
    { amount: 0, at: new Date(newer), fromLedger: true, note: null },
  );

  check(
    "数が読めない記録は使わない",
    resolveRestock(product, { [amount]: "たくさん", [at]: newer })!.amount,
    5,
  );
  check(
    "日時が読めない記録は使わない",
    resolveRestock(product, { [amount]: "8", [at]: "いつか" })!.amount,
    5,
  );
  check(
    "数だけの記録は使わない",
    resolveRestock(product, { [amount]: "8" })!.amount,
    5,
  );
  check(
    "マイナスの記録は使わない",
    resolveRestock(product, { [amount]: "-3", [at]: newer })!.amount,
    5,
  );

  // 売り切れのあいだ、商品ページに出る文章
  const note = noteKey("test-item");
  check(
    "次のご用意の目安を読む",
    resolveRestock(product, {
      [amount]: "0",
      [at]: newer,
      [note]: "次のご用意は2週間ほど先の見込みです。",
    })!.note,
    "次のご用意は2週間ほど先の見込みです。",
  );
  check(
    "初期値に戻ったときは目安を出さない",
    resolveRestock(product, {
      [amount]: "8",
      [at]: older,
      [note]: "古いお知らせ",
    })!.note,
    null,
  );
}

console.log("");
console.log("● お客様に出す一言の整え方");

check("前後の空白を落とす", cleanNote("  2週間ほど先の見込みです。  "), "2週間ほど先の見込みです。");
check("改行は1つの空白にする", cleanNote("2週間ほど\n先の見込み"), "2週間ほど 先の見込み");
// 正規表現の書き損じで、普通の文字が消えてしまっていたことがある
check("英字を消さない", cleanNote("SサイズとMサイズがあります"), "SサイズとMサイズがあります");
check("空は出さない", cleanNote("   "), null);
check("未入力は出さない", cleanNote(undefined), null);
check("文字列でないものは出さない", cleanNote(123), null);
check(
  `${NOTE_MAX_LENGTH}文字を超えたら切る`,
  cleanNote("あ".repeat(NOTE_MAX_LENGTH + 20))?.length,
  NOTE_MAX_LENGTH,
);

console.log("");
console.log("● 売れた数の数え方");

{
  const session = (
    payment_status: string,
    items: string | null,
  ) =>
    ({
      payment_status,
      metadata: items === null ? null : { items },
    }) as never;

  const counts = addSessionsToCounts(
    [
      session("paid", "dragon-fruit-350g:2"),
      session("paid", "dragon-fruit-350g:1,ryugan-100g:3"),
      // お支払いが済んでいないものは数えない
      session("unpaid", "dragon-fruit-350g:9"),
      // 読み取れないものは数えない（推測で補わない）
      session("paid", "こわれた値"),
      session("paid", null),
    ],
    new Map<string, number>(),
  );

  check("ドラゴンフルーツの合計", counts.get("dragon-fruit-350g"), 3);
  check("龍眼の合計", counts.get("ryugan-100g"), 3);
  check("数えた商品の種類", counts.size, 2);

  // 0円のご注文（将来クーポン等で起こりうる）も数える
  const free = addSessionsToCounts(
    [session("no_payment_required", "dragon-fruit-350g:1")],
    new Map<string, number>(),
  );
  check("お支払い不要のご注文も数える", free.get("dragon-fruit-350g"), 1);
}

console.log("");
if (failed > 0) {
  console.error(`✗ ${failed}件が期待どおりではありません。`);
  process.exit(1);
}
console.log("✓ すべて期待どおりです。");
