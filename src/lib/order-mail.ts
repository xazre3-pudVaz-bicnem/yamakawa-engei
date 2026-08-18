import type Stripe from "stripe";
import { getFarmMailTo, isMailConfigured, sendMail } from "@/lib/mail";
import { contactConfig, siteConfig } from "@/data/siteConfig";
import { SHIPPING } from "@/data/shipping";

/**
 * 注文確認メール
 *
 * ─────────────────────────────────────────────
 * 2通送る
 * ─────────────────────────────────────────────
 * 1. 農園へ … 発送に必要な情報（お届け先・商品・個口数）
 * 2. お客様へ … ご注文内容の控え
 *
 * ─────────────────────────────────────────────
 * 守っていること
 * ─────────────────────────────────────────────
 * ・金額はすべて Stripe が確定した値を使う。ここで計算し直さない
 * ・お名前・住所・メールアドレスをサーバーログに出さない
 * ・メールが送れなくても例外を投げない
 *   （決済は完了しているので、Webhookを失敗させてはいけない）
 */

const yen = (amount: number | null | undefined) =>
  typeof amount === "number" ? `¥${amount.toLocaleString("ja-JP")}` : "—";

/** 注文番号（注文完了ページと同じ作り方） */
export function orderNumberOf(session: Stripe.Checkout.Session): string {
  return session.id.slice(-8).toUpperCase();
}

function formatAddress(session: Stripe.Checkout.Session): string {
  const details = session.collected_information?.shipping_details;
  const address = details?.address;
  if (!address) return "（お届け先が取得できませんでした）";

  return [
    details?.name ? `${details.name} 様` : null,
    address.postal_code ? `〒${address.postal_code}` : null,
    [address.state, address.city, address.line1, address.line2]
      .filter(Boolean)
      .join(""),
  ]
    .filter(Boolean)
    .join("\n");
}

function formatItems(lineItems: Stripe.LineItem[]): string {
  if (lineItems.length === 0) return "（明細を取得できませんでした）";
  return lineItems
    .map(
      (item) =>
        `・${item.description ?? "商品"} × ${item.quantity ?? 1}　${yen(item.amount_total)}`,
    )
    .join("\n");
}

function formatAmounts(session: Stripe.Checkout.Session): string {
  const shipping = session.total_details?.amount_shipping ?? 0;
  const parcels = session.metadata?.parcels;

  return [
    `商品小計　　${yen(session.amount_subtotal)}`,
    `送料　　　　${yen(shipping)}${parcels ? `（${parcels}個口）` : ""}`,
    `お支払い額　${yen(session.amount_total)}（税込）`,
  ].join("\n");
}

/** 農園へ送る、発送用の通知（内容を確認できるよう export している） */
export function buildFarmMail(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): { subject: string; text: string } {
  const orderNo = orderNumberOf(session);
  const customerEmail =
    session.customer_details?.email ?? "（メールアドレスなし）";
  const phone = session.customer_details?.phone ?? "（電話番号なし）";

  return {
    subject: `【新規ご注文】${orderNo}　${siteConfig.name} オンラインショップ`,
    text: [
      `${siteConfig.name} オンラインショップに、新しいご注文が入りました。`,
      "",
      `注文番号　　${orderNo}`,
      "",
      "── ご注文内容 ──",
      formatItems(lineItems),
      "",
      formatAmounts(session),
      "",
      "── お届け先 ──",
      formatAddress(session),
      `電話　　${phone}`,
      `メール　${customerEmail}`,
      "",
      "── 発送 ──",
      `${SHIPPING.carrier}（${SHIPPING.dispatchLead}）`,
      session.metadata?.parcels
        ? `個口数　${session.metadata.parcels}個口`
        : null,
      session.metadata?.totalWeightGrams
        ? `商品重量　${session.metadata.totalWeightGrams}g`
        : null,
      "",
      "Stripeの管理画面でも同じ内容をご確認いただけます。",
      "https://dashboard.stripe.com/payments",
    ]
      .filter((line): line is string => line !== null)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n"),
  };
}

/** お客様へ送る、ご注文の控え（内容を確認できるよう export している） */
export function buildCustomerMail(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): { subject: string; text: string } {
  const orderNo = orderNumberOf(session);

  return {
    subject: `ご注文ありがとうございます（注文番号 ${orderNo}）｜${siteConfig.name}`,
    text: [
      "このたびは、山川園芸のオンラインショップをご利用いただき、",
      "ありがとうございます。ご注文を承りました。",
      "",
      `注文番号　　${orderNo}`,
      "",
      "── ご注文内容 ──",
      formatItems(lineItems),
      "",
      formatAmounts(session),
      "",
      "── お届け先 ──",
      formatAddress(session),
      "",
      "── 発送について ──",
      `${SHIPPING.carrier}でお届けします。`,
      `${SHIPPING.dispatchLead}。`,
      SHIPPING.note,
      "",
      "生鮮食品です。お届け後は、できるだけ早くお受け取りください。",
      "",
      "── お問い合わせ ──",
      siteConfig.name,
      `電話　${siteConfig.phone}（${siteConfig.phoneNote}）`,
      contactConfig.email ? `メール　${contactConfig.email}` : null,
      "",
      "このメールにご返信いただいても、お問い合わせを承ります。",
    ]
      .filter((line): line is string => line !== null)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n"),
  };
}

export type OrderMailOutcome = {
  farm: "sent" | "failed" | "skipped";
  customer: "sent" | "failed" | "skipped";
};

/**
 * 注文確認メールを送る。
 *
 * 設定が無いときは送らずに "skipped" を返す（例外は投げない）。
 * ログには結果と注文番号だけを残し、お名前・住所・アドレスは出さない。
 */
export async function sendOrderMails(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): Promise<OrderMailOutcome> {
  const orderNo = orderNumberOf(session);

  if (!isMailConfigured()) {
    console.error(
      `[order-mail] メールの設定が無いため送信していません（注文 ${orderNo}）。` +
        `RESEND_API_KEY と ORDER_MAIL_FROM を設定してください。`,
    );
    return { farm: "skipped", customer: "skipped" };
  }

  const outcome: OrderMailOutcome = { farm: "skipped", customer: "skipped" };

  /* ---- 1. 農園へ（発送のため、これがいちばん大事） ---- */
  const farmTo = getFarmMailTo(contactConfig.email);
  if (farmTo) {
    const mail = buildFarmMail(session, lineItems);
    const result = await sendMail({
      to: farmTo,
      subject: mail.subject,
      text: mail.text,
      // 農園から直接お客様へ返信できるようにする
      replyTo: session.customer_details?.email ?? undefined,
    });
    outcome.farm = result.ok ? "sent" : "failed";
    if (!result.ok) {
      console.error(
        `[order-mail] 農園への通知に失敗しました（注文 ${orderNo}）: ${result.reason}`,
      );
    }
  } else {
    console.error(
      `[order-mail] 農園の受信先が設定されていません（注文 ${orderNo}）。`,
    );
  }

  /* ---- 2. お客様へ ---- */
  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    const mail = buildCustomerMail(session, lineItems);
    const result = await sendMail({
      to: customerEmail,
      subject: mail.subject,
      text: mail.text,
      replyTo: contactConfig.email ?? undefined,
    });
    outcome.customer = result.ok ? "sent" : "failed";
    if (!result.ok) {
      console.error(
        `[order-mail] お客様への確認メールに失敗しました（注文 ${orderNo}）: ${result.reason}`,
      );
    }
  } else {
    console.error(
      `[order-mail] お客様のメールアドレスが取得できませんでした（注文 ${orderNo}）。`,
    );
  }

  console.log(
    `[order-mail] 注文 ${orderNo}: 農園=${outcome.farm} お客様=${outcome.customer}`,
  );

  return outcome;
}
