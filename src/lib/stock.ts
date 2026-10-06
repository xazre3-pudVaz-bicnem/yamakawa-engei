import type Stripe from "stripe";
import { getStripe, logStripeError } from "@/lib/stripe";
import { parseOrderItems } from "@/lib/order";
import { getProduct, products, type Product } from "@/data/products";

/**
 * 残りの数（在庫）の数え方
 *
 * ─────────────────────────────────────────────
 * 考え方
 * ─────────────────────────────────────────────
 * 「残り ＝ 補充した数 − 補充した日時より後に売れた数」
 * として、見るたびに数え直す。
 *
 * カウンタを1つずつ減らしていく方式にしていないのは、
 *   ・Stripeから同じ通知が2回届いても二重に減らない
 *   ・途中で処理が落ちても数がずれない
 * ようにするため。数え直す方式なら、何度実行しても同じ答えになる。
 *
 * ─────────────────────────────────────────────
 * 保存先
 * ─────────────────────────────────────────────
 * 新しいデータベースは増やさず、Stripeだけで完結させている。
 *
 *   売れた数   … Stripe の Checkout Session（お支払い済み）を数える
 *   補充の記録 … Stripe の Product（id固定）の metadata に書く
 *
 * 最初の1回分は products.ts の stock に書いてある。
 * 農園が /admin/stock から補充すると、Stripe側に新しい記録が入り、
 * そちらが優先される（コードを書き換えなくても残りの数が戻る）。
 *
 * ─────────────────────────────────────────────
 * 分からないときは売らない
 * ─────────────────────────────────────────────
 * Stripeに問い合わせられなかったときは null を返す。
 * 呼び出し側は null を「ご注文を承れない」として扱うこと。
 * 数が分からないまま受け付けて、お届けできない事態を招かないため。
 */

/** 補充の記録を置いておくための Stripe Product。商品としては販売しない */
const STOCK_PRODUCT_ID = "yamakawa_stock_ledger";

/** Stripe の metadata キーは40文字まで */
const METADATA_KEY_LIMIT = 40;

/** 1度に取得する Checkout Session の数 */
const PAGE_SIZE = 100;

/** 数えに行くページ数の上限（これを超えたら数を確定できないものとして扱う） */
const MAX_PAGES = 20;

/** 同じ数を何度も問い合わせないための保持時間（ミリ秒） */
const CACHE_TTL_MS = 15_000;

export type StockState = {
  slug: string;
  /** 補充した数 */
  stocked: number;
  /** 補充後に売れた数 */
  sold: number;
  /** 残り（0未満にはしない） */
  remaining: number;
  /** いつ補充した分を数えているか */
  since: Date;
  /** 補充の記録が Stripe 側にあるか（false なら products.ts の初期値） */
  fromLedger: boolean;
  /** 農園が書いた「次のご用意の目安」。書かれていなければ null */
  note: string | null;
};

/* ================================================================
   商品側
================================================================ */

/** 残りの数を数える商品 */
export function stockManagedProducts(): Product[] {
  return products.filter((product) => product.stock !== null);
}

export function amountKey(slug: string): string {
  return `${slug}__amount`;
}

export function atKey(slug: string): string {
  return `${slug}__at`;
}

export function noteKey(slug: string): string {
  return `${slug}__note`;
}

/** 次のご用意の目安に入れられる長さ */
export const NOTE_MAX_LENGTH = 100;

/**
 * 農園が書いた「次のご用意の目安」を、画面に出せる形に整える。
 * 長すぎるもの・改行は切り落とす。空なら null。
 */
export function cleanNote(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const text = input.replace(/\s+/g, " ").trim();
  if (text === "") return null;
  return text.slice(0, NOTE_MAX_LENGTH);
}

/**
 * metadata のキーが Stripe の制限に収まるか。
 * 収まらない slug の商品は在庫を数えられないので、テストで落とす。
 */
export function isSlugStorable(slug: string): boolean {
  return (
    amountKey(slug).length <= METADATA_KEY_LIMIT &&
    atKey(slug).length <= METADATA_KEY_LIMIT &&
    noteKey(slug).length <= METADATA_KEY_LIMIT
  );
}

/* ================================================================
   補充の記録
================================================================ */

export type Restock = {
  amount: number;
  at: Date;
  fromLedger: boolean;
  note: string | null;
};

let ledgerCache: { at: number; metadata: Stripe.Metadata } | null = null;

/** 補充の記録（Stripe側）を読む。無ければ空 */
async function readLedger(stripe: Stripe): Promise<Stripe.Metadata> {
  if (ledgerCache && Date.now() - ledgerCache.at < CACHE_TTL_MS) {
    return ledgerCache.metadata;
  }

  try {
    const product = await stripe.products.retrieve(STOCK_PRODUCT_ID);
    const metadata = product.metadata ?? {};
    ledgerCache = { at: Date.now(), metadata };
    return metadata;
  } catch (error) {
    // まだ1度も補充していなければ存在しない。これは異常ではない
    if (isMissingResourceError(error)) {
      ledgerCache = { at: Date.now(), metadata: {} };
      return {};
    }
    throw error;
  }
}

function isMissingResourceError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const status = (error as { statusCode?: number } | null)?.statusCode;
  return code === "resource_missing" || status === 404;
}

/**
 * その商品の補充の記録。products.ts の初期値と、新しいほうを採用する。
 *
 * ここが「補充したのに残りが戻らない」「補充していないのに戻る」を分ける所。
 * Stripeにつながずに確かめられるよう、外から呼べるようにしてある。
 */
export function resolveRestock(
  product: Product,
  ledger: Stripe.Metadata,
): Restock | null {
  if (!product.stock) return null;

  const initial: Restock = {
    amount: product.stock.initial,
    at: new Date(product.stock.since),
    fromLedger: false,
    note: null,
  };

  const rawAmount = ledger[amountKey(product.slug)];
  const rawAt = ledger[atKey(product.slug)];
  if (typeof rawAmount !== "string" || typeof rawAt !== "string") return initial;

  const amount = Number(rawAmount);
  const at = new Date(rawAt);
  if (!Number.isInteger(amount) || amount < 0 || Number.isNaN(at.getTime())) {
    // 記録が壊れていたら、推測せずに初期値へ戻す
    console.warn(`[stock] 補充の記録を読み取れません: ${product.slug}`);
    return initial;
  }

  // 新しいほうの記録を使う
  return at.getTime() >= initial.at.getTime()
    ? { amount, at, fromLedger: true, note: cleanNote(ledger[noteKey(product.slug)]) }
    : initial;
}

/* ================================================================
   売れた数
================================================================ */

type SoldCache = { at: number; since: number; counts: Map<string, number> };
let soldCache: SoldCache | null = null;

/**
 * 指定の日時より後に、お支払いが済んだご注文の数量を slug ごとに合計する。
 *
 * 数えるのは Checkout Session の metadata.items（slug:数量 の形）。
 * 金額や商品名は見ない。
 */
async function countSoldSince(
  stripe: Stripe,
  since: Date,
): Promise<Map<string, number> | null> {
  const sinceSec = Math.floor(since.getTime() / 1000);

  if (
    soldCache &&
    soldCache.since === sinceSec &&
    Date.now() - soldCache.at < CACHE_TTL_MS
  ) {
    return soldCache.counts;
  }

  const counts = new Map<string, number>();
  let startingAfter: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result: Stripe.ApiList<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.list({
        limit: PAGE_SIZE,
        created: { gte: sinceSec },
        status: "complete",
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

    addSessionsToCounts(result.data, counts);

    if (!result.has_more) {
      soldCache = { at: Date.now(), since: sinceSec, counts };
      return counts;
    }
    startingAfter = result.data[result.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  // 数えきれなかった。推測で埋めず、分からないものとして扱う
  console.error(
    `[stock] ご注文が多く、${MAX_PAGES * PAGE_SIZE}件までで数えきれませんでした。補充をやり直してください。`,
  );
  return null;
}

/**
 * Checkout Session の一覧から、slugごとの数量を足し込む。
 *
 * お支払いが済んでいないものは数えない。
 * metadata を読み取れないものも数えない（推測で補わない）。
 */
export function addSessionsToCounts(
  sessions: Array<
    Pick<Stripe.Checkout.Session, "payment_status"> & {
      metadata?: Stripe.Metadata | null;
    }
  >,
  counts: Map<string, number>,
): Map<string, number> {
  for (const session of sessions) {
    if (
      session.payment_status !== "paid" &&
      session.payment_status !== "no_payment_required"
    ) {
      continue;
    }

    const items = parseOrderItems(session.metadata?.items);
    if (!items) continue;

    for (const item of items) {
      counts.set(item.slug, (counts.get(item.slug) ?? 0) + item.quantity);
    }
  }
  return counts;
}

/* ================================================================
   残りの数
================================================================ */

/**
 * 残りの数を調べる。
 *
 * 返り値が null のときは「数が分からない」。
 * 呼び出し側は、売り切れと同じ扱い（ご注文を承れない）にすること。
 */
export async function getStock(slug: string): Promise<StockState | null> {
  const product = products.find((item) => item.slug === slug);
  if (!product || !product.stock) return null;

  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const ledger = await readLedger(stripe);
    const restock = resolveRestock(product, ledger);
    if (!restock) return null;

    const counts = await countSoldSince(stripe, restock.at);
    if (!counts) return null;

    const sold = counts.get(product.slug) ?? 0;
    return {
      slug: product.slug,
      stocked: restock.amount,
      sold,
      remaining: Math.max(0, restock.amount - sold),
      since: restock.at,
      fromLedger: restock.fromLedger,
      note: restock.note,
    };
  } catch (error) {
    logStripeError("stock", error);
    return null;
  }
}

/** 残りの数を数えるすべての商品について調べる */
export async function getAllStock(): Promise<Map<string, StockState | null>> {
  const result = new Map<string, StockState | null>();
  for (const product of stockManagedProducts()) {
    result.set(product.slug, await getStock(product.slug));
  }
  return result;
}

/**
 * ご注文の数量が残りに収まっているか。
 *
 * 数が分からないときも通さない。
 * 「分からないから通す」にすると、お届けできないご注文を受けてしまう。
 */
export async function checkStock(
  lines: Array<{ slug: string; name: string; quantity: number }>,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product || !product.stock) continue;

    const state = await getStock(line.slug);

    if (!state) {
      return {
        ok: false,
        status: 503,
        message: `「${line.name}」のご用意できる数を確認できませんでした。お手数ですが、時間をおいてもう一度お試しください。`,
      };
    }

    if (state.remaining <= 0) {
      return {
        ok: false,
        status: 409,
        message: `「${line.name}」はただいま売り切れです。お手数ですが、カートから削除してください。`,
      };
    }

    if (line.quantity > state.remaining) {
      return {
        ok: false,
        status: 409,
        message: `「${line.name}」はただいま${state.remaining}点までご注文いただけます。数量をご変更ください。`,
      };
    }
  }

  return { ok: true };
}

/* ================================================================
   補充する
================================================================ */

/**
 * 補充する。いまこの瞬間から数え直す。
 *
 * 農園の /admin/stock から呼ばれる。
 * 記録を置く Stripe Product が無ければ作る。
 */
export async function restock(
  slug: string,
  amount: number,
  note?: unknown,
): Promise<{ ok: true; state: StockState } | { ok: false; message: string }> {
  const product = products.find((item) => item.slug === slug);
  if (!product || !product.stock) {
    return { ok: false, message: "この商品は残りの数を数えていません。" };
  }
  if (!Number.isInteger(amount) || amount < 0 || amount > 999) {
    return { ok: false, message: "0から999までの整数でご指定ください。" };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, message: "決済の設定が完了していません。" };
  }

  const metadata = {
    [amountKey(product.slug)]: String(amount),
    [atKey(product.slug)]: new Date().toISOString(),
    // 空にしたいときは metadata から消す（Stripeは空文字で削除になる）
    [noteKey(product.slug)]: cleanNote(note) ?? "",
  };

  try {
    try {
      await stripe.products.update(STOCK_PRODUCT_ID, { metadata });
    } catch (error) {
      if (!isMissingResourceError(error)) throw error;
      await stripe.products.create({
        id: STOCK_PRODUCT_ID,
        name: "在庫の記録（販売しません）",
        active: false,
        metadata,
      });
    }

    // 書き換えたので、持っている数は捨てる
    clearStockCache();

    const state = await getStock(product.slug);
    if (!state) {
      return {
        ok: false,
        message: "補充はできましたが、残りの数を確認できませんでした。",
      };
    }
    console.log(`[stock] 補充しました: ${product.slug} → ${amount}点`);
    return { ok: true, state };
  } catch (error) {
    logStripeError("stock/restock", error);
    return {
      ok: false,
      message: "補充できませんでした。時間をおいてお試しください。",
    };
  }
}

/** 持っている数を捨てる（補充したとき・テスト） */
export function clearStockCache(): void {
  ledgerCache = null;
  soldCache = null;
}
