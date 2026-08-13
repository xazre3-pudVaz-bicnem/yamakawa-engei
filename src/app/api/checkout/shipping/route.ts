import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PARCEL, quoteShipping } from "@/data/shipping";

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
 * ・個口数は Checkout Session に保存した数量から取る。
 *   ブラウザから送られた数量も信用しない
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
    console.error("[shipping] STRIPE_SECRET_KEY が設定されていません。");
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

    /* ---- 2. 個口数はセッションの metadata から取る ---- */
    // ブラウザから送られた数量は使わない
    const totalQuantity = Number(session.metadata?.totalQuantity);
    if (!Number.isInteger(totalQuantity) || totalQuantity < 1) {
      console.error(
        `[shipping] 数量を取得できませんでした: session=${sessionId.slice(-8)}`,
      );
      return NextResponse.json({ type: "error", message: GENERIC_ERROR });
    }

    /* ---- 3. 送料を計算する ---- */
    const quote = quoteShipping(address?.state, totalQuantity, [
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
              size: PARCEL.size,
            },
          },
        },
      ],
    });

    return NextResponse.json({ type: "object", value: { succeeded: true } });
  } catch (error) {
    // 内部エラーはログにだけ残す
    console.error("[shipping] 送料の更新に失敗しました:", error);
    return NextResponse.json({ type: "error", message: GENERIC_ERROR });
  }
}
