import { NextResponse } from "next/server";
import { getAllStock } from "@/lib/stock";

/**
 * 残りの数のお知らせ（/api/stock）
 *
 * 商品ページは静的に書き出しているため、残りの数だけをここから読む。
 *
 * 返す形
 *   { "dragon-fruit-350g": 3 }   … 残り3点
 *   { "dragon-fruit-350g": null } … いま数を確認できない
 *
 * 補充した数・売れた数は返さない。お客様に必要なのは残りの数だけで、
 * 売れ行きは農園の情報だから。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getAllStock();

  const body: Record<string, number | null> = {};
  for (const [slug, state] of all) {
    body[slug] = state ? state.remaining : null;
  }

  return NextResponse.json(body, {
    headers: {
      // 数秒だけ持たせる。売り切れの反映が遅れすぎないように
      "Cache-Control": "public, max-age=10, stale-while-revalidate=30",
    },
  });
}
