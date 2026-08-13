import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { validateOrder } from "@/lib/order";
import { SHIPPING, buildShippingOptions, canCheckout, shippingBlockReason } from "@/data/shipping";
import { absoluteUrl, siteConfig } from "@/data/siteConfig";

/**
 * Stripe Checkout Session の作成（Embedded Checkout用）
 *
 * ─────────────────────────────────────────────
 * 受け取るもの
 * ─────────────────────────────────────────────
 * { lines: [{ slug: string, quantity: number }] }
 *
 * 価格・商品名は受け取らない。すべてサーバー側の商品データから引く
 * （lib/order.ts の validateOrder が関門）。
 *
 * ─────────────────────────────────────────────
 * 返すもの
 * ─────────────────────────────────────────────
 * { clientSecret: string } … Embedded Checkout の描画に使う
 *
 * 失敗時は { message: string }。
 * メッセージはお客様にそのまま見せられる日本語だけにし、
 * Stripeの内部エラーや環境変数の状態を含めない。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** お客様向けの一般的なエラーメッセージ */
const GENERIC_ERROR =
  "ただいま決済のお手続きを開始できませんでした。お手数ですが、時間をおいてもう一度お試しください。";

export async function POST(request: Request) {
  /* ---- 1. 決済が使える状態か ---- */
  const stripe = getStripe();
  if (!stripe) {
    // キーが無いことはお客様に伝えない（内部事情のため）
    console.error("[checkout] STRIPE_SECRET_KEY が設定されていません。");
    return NextResponse.json(
      {
        message:
          "ただいまオンライン決済をご利用いただけません。お手数ですが、お電話またはお問い合わせよりご連絡ください。",
      },
      { status: 503 },
    );
  }

  /* ---- 2. 送料が決まっているか ---- */
  // 送料未設定のまま注文を受けると、送料分がまるごと赤字になる。
  // 決まるまでは決済に進ませない。
  if (!canCheckout) {
    console.error(`[checkout] 送料が未設定のため決済を停止しました: ${shippingBlockReason}`);
    return NextResponse.json(
      {
        message:
          "ただいま送料の設定を行っております。お手数ですが、お電話またはお問い合わせよりご注文ください。",
      },
      { status: 503 },
    );
  }

  /* ---- 3. 注文内容の検証 ---- */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "ご注文内容を読み取れませんでした。" },
      { status: 400 },
    );
  }

  const validated = validateOrder(body);
  if (!validated.ok) {
    return NextResponse.json(
      { message: validated.message },
      { status: validated.status },
    );
  }

  /* ---- 4. Stripeに渡す明細を組み立てる ---- */
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    validated.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "jpy",
        // 円は最小単位がそのまま整数。100倍しないこと。
        unit_amount: line.product.price as number,
        product_data: {
          name: line.product.name,
          ...(line.product.volume
            ? { description: `内容量 ${line.product.volume}／${line.product.origin}` }
            : {}),
          metadata: { slug: line.product.slug, sku: line.product.id },
        },
      },
    }));

  const shippingOptions = buildShippingOptions(validated.subtotal).map(
    (option) => ({
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: { amount: option.amount, currency: "jpy" },
        display_name: option.label,
        ...(option.regionId
          ? { metadata: { regionId: option.regionId } }
          : {}),
      },
    }),
  );

  /* ---- 5. Checkout Session を作成 ---- */
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      locale: "ja",

      line_items: lineItems,

      // 日本国内向け。氏名・郵便番号・都道府県・住所を取得する
      shipping_address_collection: { allowed_countries: ["JP"] },
      ...(shippingOptions.length > 0
        ? { shipping_options: shippingOptions }
        : {}),

      // 電話番号は配送の連絡に使うため取得する
      phone_number_collection: { enabled: true },

      // 決済完了後の戻り先。session_id は Stripe が差し込む
      return_url: `${absoluteUrl("/order/complete")}?session_id={CHECKOUT_SESSION_ID}`,

      // 注文の突き合わせに使う情報。金額は入れない（Stripe側が正）
      metadata: {
        items: validated.lines
          .map((line) => `${line.product.slug}x${line.quantity}`)
          .join(","),
        shippingMode: SHIPPING.mode,
      },

      payment_intent_data: {
        description: `${siteConfig.name} オンラインショップ`,
      },
    });

    if (!session.client_secret) {
      console.error("[checkout] client_secret が返りませんでした。");
      return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    // 内部エラーはサーバーログにのみ残す。お客様には一般的な案内を返す。
    console.error("[checkout] Checkout Session の作成に失敗しました:", error);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }
}
