import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, logStripeError } from "@/lib/stripe";
import { markEventProcessed } from "@/lib/webhook-events";
import { findRegionByPrefecture } from "@/data/shipping";
import { sendOrderMails } from "@/lib/order-mail";

/**
 * Stripe Webhook（/api/stripe/webhook）
 *
 * ─────────────────────────────────────────────
 * 役割
 * ─────────────────────────────────────────────
 * 注文が確定したことの「正式な判定」はここで行う。
 * 注文完了ページの表示だけを信用してはいけない。
 * お客様がブラウザを閉じても、支払いが済んでいればここに通知が届く。
 *
 * ─────────────────────────────────────────────
 * 必要な設定
 * ─────────────────────────────────────────────
 * 環境変数 STRIPE_WEBHOOK_SECRET（Stripeダッシュボードで発行）
 * 購読するイベント: checkout.session.completed
 *                   checkout.session.async_payment_succeeded
 *                   checkout.session.async_payment_failed
 *
 * ─────────────────────────────────────────────
 * 守っていること
 * ─────────────────────────────────────────────
 * ・署名検証を必ず行う（誰でも叩けるURLなので、検証しないと偽の注文を作れる）
 * ・生のリクエストボディで検証する（JSONに変換すると署名が合わなくなる）
 * ・同じイベントが複数回来ても二重処理しない
 * ・秘密情報をログに出さない
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    // 設定漏れ。詳細は返さない
    console.error(
      "[webhook] Stripeの設定が完了していません（キーまたはWebhookシークレット）。",
    );
    return NextResponse.json({ received: false }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  // 署名検証には、加工していない生のボディが必要
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    // 署名が合わない＝Stripe以外からのリクエスト。中身は一切信用しない
    console.error(
      "[webhook] 署名の検証に失敗しました:",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json({ received: false }, { status: 400 });
  }

  // 二重処理の防止
  if (!markEventProcessed(event.id)) {
    console.log(`[webhook] 処理済みのイベントのため無視します: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        await handlePaidSession(stripe, session);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        console.warn(
          `[webhook] 支払いが失敗しました: order=${session.id.slice(-8).toUpperCase()}`,
        );
        break;
      }

      default:
        // 購読していないイベントが届いても、200を返して再送を止める
        console.log(`[webhook] 未対応のイベント: ${event.type}`);
    }
  } catch (error) {
    // ここで500を返すとStripeが再送してくれる
    // ログに残すのは type / code / message / requestId のみ
    logStripeError("webhook", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * 支払いが完了したセッションの処理
 *
 * ★ここが注文確定の正式な地点★
 *
 * ここでやっていること
 *   1. 注文内容をサーバーログに残す（個人情報は書かない）
 *   2. 農園へ発送用の通知メールを送る
 *   3. お客様へご注文の控えメールを送る
 *
 * 在庫の引き当てや注文の保存を足すときも、この関数の中に書くこと
 * （そのときは webhook-events.ts のメモリ上の重複判定を、
 *   保存先での判定に置き換える）。
 */
async function handlePaidSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (session.payment_status !== "paid") {
    console.log(
      `[webhook] 未払いのセッションのため処理しません: status=${session.payment_status}`,
    );
    return;
  }

  // イベントに含まれるセッションはお届け先が省略されることがあるため、
  // メールに使う情報は取り直した内容を正とする
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  });
  const lineItems =
    full.line_items?.data ??
    (await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 }))
      .data;

  const orderNo = full.id.slice(-8).toUpperCase();
  const items = lineItems
    .map((item) => `${item.description}×${item.quantity ?? 1}`)
    .join(" / ");

  // メールアドレスや住所は個人情報のため、ログには残さない
  console.log("──────────────────────────────────────────");
  console.log(`[webhook] 注文が確定しました`);
  console.log(`  注文番号   : ${orderNo}`);
  console.log(`  商品       : ${items}`);
  console.log(`  個口数     : ${full.metadata?.parcels ?? "-"}`);
  console.log(`  送料       : ${full.total_details?.amount_shipping ?? 0} 円`);
  console.log(`  合計       : ${full.amount_total ?? 0} 円`);
  console.log("──────────────────────────────────────────");

  // 地域別送料を使っている場合、お客様が選んだ地域と
  // 実際のお届け先が食い違っていないかを確認する。
  // （Stripeは住所から送料を自動選択しないため）
  warnIfShippingRegionMismatch(full);

  // メールの失敗で例外を投げない。
  // ここで500を返すとStripeが再送し、同じ注文が何度も処理されてしまう。
  await sendOrderMails(full, lineItems);
}

/** 選ばれた送料の地域と、お届け先の都道府県がずれていたら警告する */
function warnIfShippingRegionMismatch(session: Stripe.Checkout.Session): void {
  // Checkout Session の型では shipping_cost.shipping_rate は ID か展開済みオブジェクト。
  // ここでは metadata を持つ展開済みの場合だけを見る。
  const rate = session.shipping_cost?.shipping_rate;
  const selectedRegionId =
    rate && typeof rate === "object" ? rate.metadata?.regionId : undefined;
  if (!selectedRegionId) return;

  const prefecture = session.collected_information?.shipping_details?.address?.state;
  if (!prefecture) return;

  const actualRegion = findRegionByPrefecture(prefecture);
  if (actualRegion && actualRegion.id !== selectedRegionId) {
    console.warn(
      `[webhook] 送料の地域が一致しません: 注文=${session.id.slice(-8).toUpperCase()} ` +
        `選択=${selectedRegionId} 実際=${actualRegion.id}。発送前にご確認ください。`,
    );
  }
}
