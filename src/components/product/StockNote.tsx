"use client";

import { useStock } from "@/components/cart/useStock";
import type { Product } from "@/data/products";

/**
 * 一覧に出す「ただいま○点」の一行
 *
 * 商品ページと同じ /api/stock から読む。
 * 確認中・確認できないときは何も出さない（売り切れかどうかは
 * 商品ページとご購入手続きで必ず確かめるため、ここで断定しない）。
 *
 * 「残り○点」とは書かない。急かすための表示にしないこと。
 */
export default function StockNote({ product }: { product: Product }) {
  const counted = product.stock !== null;
  const stock = useStock(product.slug, counted);

  if (!counted || typeof stock !== "number") return null;

  return (
    <span className="text-forest">
      ／{stock > 0 ? `ただいま${stock}点` : "ただいま売り切れ"}
    </span>
  );
}
