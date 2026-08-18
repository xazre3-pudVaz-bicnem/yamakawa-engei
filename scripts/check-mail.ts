/**
 * 注文確認メールの設定を確認するスクリプト
 *
 * 実行:
 *   npm run check:mail                     … 設定の確認だけ
 *   npm run check:mail -- test@example.com … 実際に1通送ってみる
 *
 * ★APIキーは表示しない★
 * 出すのは設定の有無と、送信サービスが返したエラー内容だけ。
 */

import type Stripe from "stripe";
import { isMailConfigured, sendMail } from "../src/lib/mail";
import { buildCustomerMail, buildFarmMail } from "../src/lib/order-mail";
import { contactConfig, siteConfig } from "../src/data/siteConfig";

let failed = 0;

function line(ok: boolean, label: string, detail = "") {
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "NG "} ${label}${detail ? `  ${detail}` : ""}`);
}

const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
const from = process.env.ORDER_MAIL_FROM?.trim() ?? "";
const to = process.env.ORDER_MAIL_TO?.trim() ?? "";

console.log("■ メール送信の設定");
console.log(
  `  RESEND_API_KEY  = ${apiKey ? `設定あり length=${apiKey.length} prefix=${apiKey.slice(0, 3)}` : "未設定"}`,
);
console.log(`  ORDER_MAIL_FROM = ${from || "未設定"}`);
console.log(
  `  ORDER_MAIL_TO   = ${to || `未設定（siteConfig の ${contactConfig.email ?? "（メールなし）"} に送ります）`}`,
);

console.log("\n■ 確認");
line(Boolean(apiKey), "APIキーが設定されている");
line(apiKey.startsWith("re_") || !apiKey, "APIキーの形が正しい（re_ で始まる）");
line(Boolean(from), "差出人が設定されている");
line(
  /<[^@\s]+@[^@\s]+>$|^[^@\s]+@[^@\s]+$/.test(from) || !from,
  "差出人の形が正しい",
  from ? "" : "（例: 山川園芸 <order@yamakawaengei.com>）",
);
line(
  Boolean(to || contactConfig.email),
  "農園側の受信先がある",
  to || contactConfig.email || "",
);
line(isMailConfigured(), "メール送信が有効");

/* ================================================================
   どんなメールが届くかを確認する（--preview）
================================================================ */
if (process.argv.includes("--preview")) {
  // 実際のご注文と同じ形の、架空のデータ
  const sample = {
    id: "cs_live_a1b2c3d4e5f6g7h8SAMPLE01",
    amount_subtotal: 4300,
    amount_total: 6035,
    total_details: { amount_shipping: 1735 },
    metadata: { parcels: "1", totalWeightGrams: "850" },
    customer_details: { email: "okyakusama@example.com", phone: "090-0000-0000" },
    collected_information: {
      shipping_details: {
        name: "山川 太郎",
        address: {
          postal_code: "150-0041",
          state: "東京都",
          city: "渋谷区",
          line1: "神南1-1-1",
          line2: "サンプルビル101",
        },
      },
    },
  } as unknown as Stripe.Checkout.Session;

  const sampleItems = [
    { description: "生ライチ 500g", quantity: 1, amount_total: 2500 },
    { description: "生ライチ 350g", quantity: 1, amount_total: 1800 },
  ] as unknown as Stripe.LineItem[];

  for (const [label, mail] of [
    ["農園あて", buildFarmMail(sample, sampleItems)],
    ["お客様あて", buildCustomerMail(sample, sampleItems)],
  ] as const) {
    console.log(`\n──────── ${label} ────────`);
    console.log(`件名: ${mail.subject}`);
    console.log("");
    console.log(mail.text);
  }
}

/* ================================================================
   実際に送ってみる
================================================================ */
const testTo = process.argv.slice(2).find((arg) => arg.includes("@"));

async function sendTest(): Promise<void> {
  if (!testTo) {
    console.log(
      "\n  （宛先を指定すると、実際に1通送ってみます: npm run check:mail -- you@example.com）",
    );
    return;
  }

  if (!isMailConfigured()) {
    console.log("\n■ 送信テスト");
    console.log("  -- 設定が足りないため送信しません。");
    failed++;
    return;
  }

  console.log(`\n■ 送信テスト（宛先 ${testTo}）`);

  const result = await sendMail({
    to: testTo,
    subject: `【テスト】注文確認メールの設定確認｜${siteConfig.name}`,
    text: [
      "これは、注文確認メールが届くかどうかを確かめるためのテスト送信です。",
      "",
      "このメールが届いていれば、ご注文時の確認メールも同じ経路で届きます。",
      "",
      siteConfig.name,
      `電話　${siteConfig.phone}`,
    ].join("\n"),
    replyTo: contactConfig.email ?? undefined,
  });

  if (result.ok) {
    line(true, "送信しました", `id=${result.id}`);
    console.log("      → 受信箱と迷惑メールフォルダをご確認ください。");
  } else {
    line(false, "送信できませんでした");
    console.log(`      理由: ${result.reason}`);
    if (result.reason.includes("403") || result.reason.includes("domain")) {
      console.log(
        "      → 差出人ドメインの認証がまだの可能性があります。Resendの Domains で確認してください。",
      );
    }
  }
}

sendTest().then(() => {
  console.log("");
  if (failed > 0) {
    console.error(`✗ ${failed}件に問題があります。注文確認メールは届きません。`);
    process.exit(1);
  }
  console.log("✓ 注文確認メールの設定に問題はありません。");
});
