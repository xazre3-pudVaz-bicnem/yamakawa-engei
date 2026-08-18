/**
 * Stripeの設定を確認するスクリプト
 *
 * 実行:
 *   npm run check:stripe                       … ローカルの環境変数で確認
 *   vercel env pull .env.production.local --environment=production
 *   npm run check:stripe                       … 本番と同じキーで確認
 *
 * ─────────────────────────────────────────────
 * 何を確認するか
 * ─────────────────────────────────────────────
 * 1. キーが設定されているか
 * 2. 形が正しいか（伏せ字のコピー・改行の混入・途中で切れていないか）
 * 3. 本番キーとテストキーが混ざっていないか
 * 4. 2つのキーが同じStripeアカウントのものか
 * 5. Stripeに実際に通るか（アカウント情報を1件取得してみる）
 *
 * ★キーの値は一切表示しない★
 * 出すのは長さ・接頭辞・文字種と、Stripeが返した
 * type / code / message / requestId だけ。
 */

import Stripe from "stripe";
import {
  describeKeyShape,
  describeStripeError,
  getKeyPairDiagnostics,
} from "../src/lib/stripe";

let failed = 0;

function line(ok: boolean, label: string, detail = "") {
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "NG "} ${label}${detail ? `  ${detail}` : ""}`);
}

const pair = getKeyPairDiagnostics();

console.log("■ キーの形（値は表示しません）");
console.log(`  ${describeKeyShape("STRIPE_SECRET_KEY", pair.secret)}`);
console.log(
  `  ${describeKeyShape("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", pair.publishable)}`,
);
console.log(
  `  STRIPE_WEBHOOK_SECRET=${
    process.env.STRIPE_WEBHOOK_SECRET?.trim()
      ? `設定あり length=${process.env.STRIPE_WEBHOOK_SECRET.trim().length} prefix=${process.env.STRIPE_WEBHOOK_SECRET.trim().slice(0, 6)}`
      : "未設定"
  }`,
);

console.log("\n■ 設定の整合性");
line(pair.secret.present, "シークレットキーが設定されている");
line(pair.publishable.present, "公開鍵が設定されている");
line(pair.secret.wellFormed, "シークレットキーの形が正しい");
line(pair.publishable.wellFormed, "公開鍵の形が正しい");
line(!pair.secret.hasUnexpectedChars, "シークレットキーに英数字以外が無い");
line(!pair.secret.hadSurroundingWhitespace, "シークレットキーの前後に空白が無い");
line(!pair.modeMismatch, "本番キーとテストキーが混ざっていない", `secret=${pair.secret.mode} publishable=${pair.publishable.mode}`);
line(
  !pair.accountMismatch,
  "2つのキーが同じStripeアカウント",
  `secret=${pair.secret.account ?? "-"} publishable=${pair.publishable.account ?? "-"}`,
);

/* ================================================================
   実際にStripeへ通るか
================================================================ */
console.log("\n■ Stripeへの疎通");

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

async function checkConnection(): Promise<void> {
  if (!secretKey || !pair.secret.wellFormed) {
    console.log("  -- キーの形が正しくないため、疎通確認は行いません。");
    failed++;
    return;
  }

  const stripe = new Stripe(secretKey, {
    appInfo: { name: "yamakawaengei-check" },
  });

  try {
    // null を渡すと、キーに紐づくアカウント自身を取得する
    const account = await stripe.accounts.retrieve(null);
    line(true, "キーが有効です");
    console.log(`      アカウント : ${account.id}`);
    console.log(`      国         : ${account.country ?? "-"}`);
    console.log(`      決済の受付 : ${account.charges_enabled ? "有効" : "無効"}`);
    console.log(`      入金        : ${account.payouts_enabled ? "有効" : "無効"}`);

    if (
      pair.publishable.account &&
      !account.id.includes(pair.publishable.account.slice(2))
    ) {
      // 参考情報。アカウントIDと公開鍵の識別子は形が違うため、警告にとどめる
      console.log("      （公開鍵の識別子との対応は Stripe ダッシュボードでご確認ください）");
    }

    if (!account.charges_enabled) {
      line(false, "このアカウントでは決済を受け付けられません（本番利用の審査をご確認ください）");
    }
  } catch (error) {
    const info = describeStripeError(error);
    line(false, "キーがStripeに拒否されました");
    console.log(`      type      : ${info.type}`);
    console.log(`      code      : ${info.code}`);
    console.log(`      status    : ${info.statusCode ?? "-"}`);
    console.log(`      requestId : ${info.requestId}`);
    console.log(`      message   : ${info.message}`);

    if (info.isAuthError) {
      console.log("");
      console.log("      → キーそのものが無効です。次のいずれかです。");
      console.log("         ・Stripeでキーを再発行（ロール）したため、古い値が残っている");
      console.log("         ・別のStripeアカウントのキーが入っている");
      console.log("         ・ダッシュボードの伏せ字表示をそのままコピーした");
      console.log("      → Stripeダッシュボード → 開発者 → APIキー でシークレットキーを再発行し、");
      console.log("         Vercelの STRIPE_SECRET_KEY を入れ替えて再デプロイしてください。");
    }
  }
}

checkConnection().then(() => {
  console.log("");
  if (failed > 0) {
    console.error(`✗ ${failed}件に問題があります。`);
    process.exit(1);
  }
  console.log("✓ Stripeの設定に問題はありません。");
});
