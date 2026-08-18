import { NextResponse } from "next/server";
import { getStripe, logStripeError } from "@/lib/stripe";
import { PARCEL, quoteShipping } from "@/data/shipping";
import { decodeOrderItems } from "@/lib/order";

/**
 * お届け先の住所から送料を計算して、Checkout Session を更新する
 *
 * ─────────────────────────────────────────────
 * いつ呼ばれるか
 * ─────────────────────────────────────────────
 * お客様がStripeの決済画面で配送先住所を入力し終えたとき、
 * ブラウザ側の onShippingDetailsChange から呼ばれる。
 *
 * ─────────────────────────────────────────────
 * ここで守っていること
 * ─────────────────────────────────────────────
 * ・送料はサーバー側で計算する。ブラウザから送られた金額は受け取らない
 * ・個口数もサーバー側で計算し直す。
 *   Checkout Session に保存した「商品のslugと数量」から商品データを引き直し、
 *   重量をもとに詰め直す。ブラウザから送られた個口数・数量は信用しない
 * ・支払い済み・期限切れのセッションは更新しない
 * ・クール便を扱えない住所は、その場でお断りする
 *
 * 返す形（Stripeの仕様）
 *   成功: { type: "object", value: { succeeded: true } }
 *   失敗: { type: "error", message: "お客様に見せる日本語" }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ShippingDetails = {
  name?: string;
  address?: {
    country?: string;
    postal_code?: string;
    state?: string;
    city?: string;
    line1?: string;
    line2?: string;
  };
};

/** お客様に見せる一般的なエラー */
const GENERIC_ERROR =
  "送料を計算できませんでした。お手数ですが、住所をご確認のうえもう一度お試しください。";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    // 原因は getStripe() 側がサーバーログに残している
    return NextResponse.json({ type: "error", message: GENERIC_ERROR });
  }

  let body: {
    checkout_session_id?: unknown;
    shipping_details?: ShippingDetails;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ type: "error", message: GENERIC_ERROR });
  }

  const sessionId =
    typeof body.checkout_session_id === "string"
      ? body.checkout_session_id
      : "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ type: "error", message: GENERIC_ERROR });
  }

  const address = body.shipping_details?.address;

  try {
    /* ---- 1. セッションを取り直す（数量の正はこちら） ---- */
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status === "complete" || session.status === "expired") {
      return NextResponse.json({
        type: "error",
        message:
          "このお手続きは終了しています。お手数ですが、カートからやり直してください。",
      });
    }

    // 日本国内のみ
    if (address?.country && address.country !== "JP") {
      return NextResponse.json({
        type: "error",
        message: "申し訳ございませんが、海外へのお届けは承っておりません。",
      });
    }

    /* ---- 2. 注文内容はセッションの metadata から取り直す ---- */
    // ブラウザから送られた数量・個口数は使わない。
    // slugと数量だけを取り出し、重量は商品データから引き直す。
    const lines = decodeOrderItems(session.metadata?.items);
    if (!lines) {
      console.error(
        `[shipping] 注文内容を取得できませんでした: session=${sessionId.slice(-8)}`,
      );
      return NextResponse.json({ type: "error", message: GENERIC_ERROR });
    }

    /* ---- 3. 個口数と送料を計算する ---- */
    const quote = quoteShipping(address?.state, lines, [
      address?.city,
      address?.line1,
      address?.line2,
    ]);

    if (!quote.ok) {
      // 住所が対象外・都道府県が読み取れない等。理由はそのまま案内してよい内容
      return NextResponse.json({ type: "error", message: quote.reason });
    }

    /* ---- 4. セッションを更新する ---- */
    await stripe.checkout.sessions.update(sessionId, {
      collected_information: {
        shipping_details: {
          name: body.shipping_details?.name ?? "",
          address: {
            country: "JP",
            postal_code: address?.postal_code ?? "",
            state: address?.state ?? "",
            city: address?.city ?? "",
            line1: address?.line1 ?? "",
            line2: address?.line2 ?? "",
          },
        },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: quote.amount, currency: "jpy" },
            display_name: quote.label,
            metadata: {
              regionId: quote.region.id,
              parcels: String(quote.parcels),
              unitRate: String(quote.unitRate),
              totalWeightGrams: String(quote.totalWeightGrams),
              size: PARCEL.size,
            },
          },
        },
      ],
    });

    return NextResponse.json({ type: "object", value: { succeeded: true } });
  } catch (error) {
    // ログに残すのは type / code / message / requestId のみ
    logStripeError("shipping", error);
    return NextResponse.json({ type: "error", message: GENERIC_ERROR });
  }
}
