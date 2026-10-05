"use client";

import { useEffect, useState } from "react";

/**
 * 残りの数を /api/stock から読む
 *
 * 商品ページは静的に書き出しているため、数だけをあとから読みに行く。
 *
 * "loading" … 確認中
 * "unknown" … 確認できなかった（売り切れと同じ扱いにする）
 * 数値      … 残りの数
 *
 * 読めなかったときに「たくさんある」とみなさないこと。
 * お届けできないご注文を受けてしまう。
 */
export type StockView = "loading" | "unknown" | number;

/** 同じ数を何度も取りに行かないよう、タブの中で持っておく */
let cache: { at: number; body: Record<string, number | null> } | null = null;
const CACHE_TTL_MS = 10_000;

async function fetchStock(): Promise<Record<string, number | null>> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.body;

  const response = await fetch("/api/stock", { cache: "no-store" });
  if (!response.ok) throw new Error(String(response.status));

  const body = (await response.json()) as Record<string, number | null>;
  cache = { at: Date.now(), body };
  return body;
}

export function useStock(slug: string, enabled: boolean): StockView {
  const [view, setView] = useState<StockView>(enabled ? "loading" : "unknown");

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    fetchStock()
      .then((body) => {
        if (!alive) return;
        const value = body[slug];
        setView(typeof value === "number" ? value : "unknown");
      })
      .catch(() => {
        if (alive) setView("unknown");
      });

    return () => {
      alive = false;
    };
  }, [slug, enabled]);

  return view;
}

/** 補充したあとなどに、持っている数を捨てる */
export function clearStockViewCache(): void {
  cache = null;
}
