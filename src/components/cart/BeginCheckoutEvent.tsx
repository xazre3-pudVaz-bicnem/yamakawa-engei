"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * 購入手続き画面に到達したことを1回だけ送る（GA4: begin_checkout）
 *
 * 画面には何も描画しない。
 * カートの読み込みが終わって中身が確定してから送りたいので、
 * items が入ったタイミングで一度だけ発火させている。
 */
export default function BeginCheckoutEvent({
  value,
  items,
}: {
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    price?: number;
    quantity: number;
  }>;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || items.length === 0) return;
    sent.current = true;
    track("begin_checkout", { currency: "JPY", value, items });
  }, [value, items]);

  return null;
}
