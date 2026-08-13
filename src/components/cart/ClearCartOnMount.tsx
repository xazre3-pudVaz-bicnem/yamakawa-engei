"use client";

import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";

/**
 * 決済が完了したらカートを空にする
 *
 * 画面には何も描画しない。
 * 注文完了ページでサーバー側が「支払い済み」と確認できたときだけ置く。
 * （URLを直接開いただけでカートが消えると、お客様が困るため）
 */
export default function ClearCartOnMount() {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    clear();
  }, [clear]);

  return null;
}
