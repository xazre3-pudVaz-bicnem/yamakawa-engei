import { getProduct, isBuyable, type Product } from "@/data/products";

/**
 * 注文内容の検証
 *
 * ─────────────────────────────────────────────
 * いちばん大事なこと
 * ─────────────────────────────────────────────
 * ブラウザから受け取ってよいのは「商品のslug」と「数量」だけ。
 * 価格・商品名・合計金額は、必ずここでサーバー側の商品データから引き直す。
 *
 * お客様がブラウザの開発者ツールで価格を書き換えても、
 * 決済される金額は変わらない、という状態を保つための関門。
 */

/** ブラウザから受け取る形 */
export type RequestLine = { slug: unknown; quantity: unknown };

/** 検証を通ったあとの形（サーバー側の値だけで構成される） */
export type ValidatedLine = {
  product: Product;
  quantity: number;
  /** サーバー側の価格 × 数量 */
  lineTotal: number;
};

export type ValidationResult =
  | { ok: true; lines: ValidatedLine[]; subtotal: number }
  | { ok: false; status: number; message: string };

/** 1回のご注文で受け付ける商品の種類の上限（異常な量のリクエストを弾く） */
const MAX_LINE_COUNT = 20;

/**
 * 注文内容を検証する。
 * 失敗したときは、お客様にそのまま見せられる日本語のメッセージを返す
 * （内部のエラー内容は含めない）。
 */
export function validateOrder(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, status: 400, message: "ご注文内容を読み取れませんでした。" };
  }

  const rawLines = (input as { lines?: unknown }).lines;
  if (!Array.isArray(rawLines) || rawLines.length === 0) {
    return {
      ok: false,
      status: 400,
      message: "カートに商品が入っていません。",
    };
  }

  if (rawLines.length > MAX_LINE_COUNT) {
    return {
      ok: false,
      status: 400,
      message: "ご注文の商品数が多すぎます。数を減らしてお試しください。",
    };
  }

  const merged = new Map<string, number>();

  for (const raw of rawLines as RequestLine[]) {
    const slug = typeof raw?.slug === "string" ? raw.slug.trim() : "";
    if (!slug) {
      return {
        ok: false,
        status: 400,
        message: "ご注文内容を読み取れませんでした。",
      };
    }

    const product = getProduct(slug);
    if (!product) {
      return {
        ok: false,
        status: 400,
        message: "お取り扱いのない商品が含まれています。カートをご確認ください。",
      };
    }

    if (!isBuyable(product) || product.price === null) {
      return {
        ok: false,
        status: 409,
        message: `「${product.name}」はただいまご購入いただけません。カートから削除してください。`,
      };
    }

    // 数量の検証。小数・負数・0・NaN・文字列をすべて弾く
    const quantity = Number(raw?.quantity);
    if (
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return {
        ok: false,
        status: 400,
        message: "数量が正しくありません。1以上の整数でご指定ください。",
      };
    }

    // 同じ商品が複数行で送られてきた場合は合算してから上限を判定する
    merged.set(slug, (merged.get(slug) ?? 0) + quantity);
  }

  const lines: ValidatedLine[] = [];

  for (const [slug, quantity] of merged) {
    // 上のループで存在確認済みだが、型を絞るために引き直す
    const product = getProduct(slug);
    if (!product || product.price === null) {
      return {
        ok: false,
        status: 400,
        message: "お取り扱いのない商品が含まれています。カートをご確認ください。",
      };
    }

    if (quantity > product.maxQuantity) {
      return {
        ok: false,
        status: 400,
        message: `「${product.name}」は1回のご注文で最大${product.maxQuantity}点までです。`,
      };
    }

    lines.push({
      product,
      quantity,
      // ★価格はサーバー側の商品データから引いた値だけを使う★
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  if (subtotal <= 0) {
    return {
      ok: false,
      status: 400,
      message: "ご注文金額を確認できませんでした。カートをご確認ください。",
    };
  }

  return { ok: true, lines, subtotal };
}
