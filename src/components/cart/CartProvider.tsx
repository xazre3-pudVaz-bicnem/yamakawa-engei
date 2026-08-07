"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/data/products";

/**
 * カート
 *
 * ─────────────────────────────────────────────
 * 設計方針
 * ─────────────────────────────────────────────
 * - localStorage には「slug と数量」だけを保存する。
 *   価格・商品名は毎回 data/products.ts から引き直すので、
 *   商品データを更新すればカートの表示も自動的に新しくなる
 *   （古い価格がカートに残り続けることがない）。
 * - 保存されている slug が商品データから消えていた場合は、
 *   表示を組み立てるときに自動的に取り除く。
 * - localStorage は React の外にある状態なので useSyncExternalStore で購読する。
 *   これによりサーバー描画（空のカート）とクライアント描画のずれが
 *   React 側で正しく処理され、別タブでの変更にも自動で追従する。
 */

const STORAGE_KEY = "yamakawaengei.cart.v1";
/** 同じタブ内での更新を購読者へ知らせるためのイベント名 */
const CART_EVENT = "yamakawaengei:cart-change";

/** localStorage に保存する最小の形 */
type StoredLine = { slug: string; quantity: number };

/** サーバー描画時とカートが空のときに返す、参照が変わらない配列 */
const EMPTY: StoredLine[] = [];

/* ================================================================
   localStorage との橋渡し
================================================================ */

// useSyncExternalStore は「同じ内容なら同じ参照」を返すことを求める。
// 直前に読んだ生文字列とパース結果を覚えておき、変化がなければ使い回す。
let cachedRaw: string | null = null;
let cachedLines: StoredLine[] = EMPTY;

function parseLines(raw: string | null): StoredLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const lines = parsed
      .filter(
        (item): item is StoredLine =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as StoredLine).slug === "string" &&
          Number.isFinite((item as StoredLine).quantity),
      )
      .map((item) => ({
        slug: item.slug,
        quantity: Math.max(1, Math.floor(item.quantity)),
      }));

    return lines.length === 0 ? EMPTY : lines;
  } catch {
    // 壊れた値が入っていてもサイト全体を止めない
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // プライベートブラウジング等で読めない場合
    return null;
  }
}

function getSnapshot(): StoredLine[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  cachedLines = parseLines(raw);
  return cachedLines;
}

function getServerSnapshot(): StoredLine[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  // storage イベントは別タブでの変更のみ発火するため、
  // 同じタブ内の更新は自前のイベントで知らせる。
  window.addEventListener("storage", onChange);
  window.addEventListener(CART_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_EVENT, onChange);
  };
}

function writeLines(lines: StoredLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // 書き込めない環境では黙って諦める（画面は動き続ける）
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

/** localStorage を読み終えたか（＝ハイドレーション後か）を返すための購読 */
const getTrue = () => true;
const getFalse = () => false;

/* ================================================================
   Context
================================================================ */

/** 画面で使う、商品データと結合済みの形 */
export type CartLine = {
  product: Product;
  quantity: number;
  /** price が null の商品は null */
  lineTotal: number | null;
};

type CartContextValue = {
  lines: CartLine[];
  /** 商品点数の合計 */
  totalQuantity: number;
  /** 小計（価格未確定の商品を含む場合は null） */
  subtotal: number | null;
  /** 価格が未確定の商品がカートに入っているか */
  hasUnpricedItem: boolean;
  /** localStorage の読み込みが終わったか（SSRとの表示ずれを防ぐ） */
  isReady: boolean;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isReady = useSyncExternalStore(subscribe, getTrue, getFalse);

  const add = useCallback((slug: string, quantity = 1) => {
    const product = getProduct(slug);
    if (!product) return;

    const current = getSnapshot();
    const existing = current.find((line) => line.slug === slug);

    const next = existing
      ? current.map((line) =>
          line.slug === slug
            ? {
                ...line,
                quantity: Math.min(
                  product.maxQuantity,
                  line.quantity + quantity,
                ),
              }
            : line,
        )
      : [
          ...current,
          {
            slug,
            quantity: Math.min(product.maxQuantity, Math.max(1, quantity)),
          },
        ];

    writeLines(next);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const product = getProduct(slug);
    if (!product) return;

    const current = getSnapshot();
    const next =
      quantity <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) =>
            line.slug === slug
              ? {
                  ...line,
                  quantity: Math.min(
                    product.maxQuantity,
                    Math.floor(quantity),
                  ),
                }
              : line,
          );

    writeLines(next);
  }, []);

  const remove = useCallback((slug: string) => {
    writeLines(getSnapshot().filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => writeLines([]), []);

  // 保存値と商品データを結合する。商品データから消えた slug はここで落ちる。
  const lines = useMemo<CartLine[]>(() => {
    return stored
      .map((line) => {
        const product = getProduct(line.slug);
        if (!product) return null;
        return {
          product,
          quantity: line.quantity,
          lineTotal:
            product.price === null ? null : product.price * line.quantity,
        };
      })
      .filter((line): line is CartLine => line !== null);
  }, [stored]);

  const totalQuantity = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const hasUnpricedItem = useMemo(
    () => lines.some((line) => line.lineTotal === null),
    [lines],
  );

  const subtotal = useMemo(() => {
    if (lines.length === 0) return 0;
    if (hasUnpricedItem) return null;
    return lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0);
  }, [lines, hasUnpricedItem]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity,
      subtotal,
      hasUnpricedItem,
      isReady,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [
      lines,
      totalQuantity,
      subtotal,
      hasUnpricedItem,
      isReady,
      add,
      setQuantity,
      remove,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart は CartProvider の内側でのみ使用できます。");
  }
  return context;
}
