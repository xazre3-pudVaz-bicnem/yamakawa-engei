import Stripe from "stripe";

/**
 * Stripe クライアント（サーバー専用）
 *
 * ─────────────────────────────────────────────
 * 絶対に守ること
 * ─────────────────────────────────────────────
 * このファイルは Route Handler / Server Component からのみ import すること。
 * クライアントコンポーネント（"use client"）から import すると、
 * シークレットキーがブラウザに渡ってしまう。
 *
 * 公開鍵（NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY）はブラウザで使ってよいが、
 * シークレットキー（STRIPE_SECRET_KEY）は絶対にクライアントへ出さない。
 *
 * ─────────────────────────────────────────────
 * 環境変数
 * ─────────────────────────────────────────────
 * STRIPE_SECRET_KEY        … 必須。サーバー側でのみ使用
 * STRIPE_WEBHOOK_SECRET    … Webhookの署名検証に使用
 */

let cached: Stripe | null = null;

/**
 * Stripe クライアントを取得する。
 * キーが未設定なら null を返すので、呼び出し側で
 * 「ただいま決済をご利用いただけません」と案内できる。
 * （キーの有無をエラーメッセージに含めないこと）
 */
export function getStripe(): Stripe | null {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;

  cached = new Stripe(secretKey, {
    // APIバージョンはSDKの既定に任せる。
    // ここで固定すると、SDK更新時に型とAPIがずれて事故になりやすい。
    appInfo: {
      name: "yamakawaengei",
      url: "https://www.yamakawaengei.com",
    },
  });
  return cached;
}

/** 決済が使える状態か（キーが設定されているか） */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
