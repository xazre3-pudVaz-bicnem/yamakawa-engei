import { getProduct, isBuyable, type Product } from "@/data/products";
import type { ShippingLine } from "@/data/shipping";

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

    // 重量が無いと個口数＝送料を計算できない。
    // 架空の送料で受け付けるくらいなら、ここで止める。
    if (product.weightGrams === null) {
      return {
        ok: false,
        status: 409,
        message: `「${product.name}」はただいまオンラインでのご注文を承れません。お手数ですが、お問い合わせよりご連絡ください。`,
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

/**
 * 検証済みの注文を、送料計算に渡せる形にする。
 *
 * 重量はサーバー側の商品データ（products.ts）から取る。
 * ブラウザから送られてきた重量・個口数は使わない。
 */
export function toShippingLines(lines: ValidatedLine[]): ShippingLine[] {
  return lines.map((line) => ({
    name: line.product.name,
    weightGrams: line.product.weightGrams,
    quantity: line.quantity,
  }));
}

/**
 * Checkout Session の metadata に入れる注文内容の文字列。
 * 「slug:数量」をカンマでつないだ形（slugにコロンとカンマは使わない）。
 * 送料を計算し直すときに、この文字列から商品データを引き直す。
 */
export function encodeOrderItems(lines: ValidatedLine[]): string {
  return lines
    .map((line) => `${line.product.slug}:${line.quantity}`)
    .join(",");
}

/**
 * encodeOrderItems で作った文字列を、送料計算に渡せる形に戻す。
 * 商品名と重量は、必ずサーバー側の商品データから引き直す。
 * 読み取れない値が1つでもあれば null を返す（推測で補わない）。
 */
export function decodeOrderItems(raw: string | undefined | null): ShippingLine[] | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;

  const lines: ShippingLine[] = [];

  for (const part of raw.split(",")) {
    const [slug, rawQuantity] = part.split(":");
    const product = getProduct((slug ?? "").trim());
    if (!product) return null;

    const quantity = Number(rawQuantity);
    if (!Number.isInteger(quantity) || quantity < 1) return null;

    lines.push({
      name: product.name,
      weightGrams: product.weightGrams,
      quantity,
    });
  }

  return lines.length > 0 ? lines : null;
}
