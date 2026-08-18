/**
 * メール送信（サーバー専用）
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * Resend の HTTP API を fetch で叩くだけの、薄い送信部品。
 * SDKを入れていないのは、依存を増やさないため。
 * 別のサービスに乗り換えるときも、この1ファイルだけを差し替えればよい。
 *
 * ─────────────────────────────────────────────
 * 環境変数
 * ─────────────────────────────────────────────
 * RESEND_API_KEY        … 必須。未設定ならメールを送らない（決済は止めない）
 * ORDER_MAIL_FROM       … 差出人。例 "山川園芸 <order@yamakawaengei.com>"
 * ORDER_MAIL_TO         … 農園side の受信先。未設定なら siteConfig の連絡先
 *
 * ★キーはコードに書かない。必ず環境変数から読む★
 * ★ログにメール本文・住所・氏名を出さない★
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type MailMessage = {
  /** 宛先。複数指定できる */
  to: string | string[];
  subject: string;
  /** 本文（プレーンテキスト）。HTMLメールは使わない */
  text: string;
  /** 返信先。お客様への確認メールでは農園のアドレスを入れる */
  replyTo?: string;
};

export type MailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string; skipped?: boolean };

/** メール送信が使える状態か */
export function isMailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.ORDER_MAIL_FROM?.trim(),
  );
}

/**
 * 農園側の受信先（注文通知の宛先）。
 *
 * ORDER_MAIL_TO はカンマ区切りで複数指定できる。
 * 1つのアドレスが迷惑メール扱いになっても注文を取りこぼさないよう、
 * 携帯で受け取れるアドレスなどを併記しておくとよい。
 */
export function getFarmMailTo(fallback: string | null): string[] {
  const configured = (process.env.ORDER_MAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter((address) => address.includes("@"));

  if (configured.length > 0) return configured;
  return fallback ? [fallback] : [];
}

/**
 * メールを1通送る。
 *
 * 送れなかった場合も例外は投げない。
 * 決済はすでに完了しているので、メールの失敗で
 * Webhookを失敗扱いにしない（Stripeが何度も再送してしまう）。
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_MAIL_FROM?.trim();

  if (!apiKey || !from) {
    return {
      ok: false,
      skipped: true,
      reason: "RESEND_API_KEY または ORDER_MAIL_FROM が未設定です。",
    };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    const payload: { id?: string; message?: string; name?: string } =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      // 返ってきたエラーの説明だけを残す。宛先や本文は残さない。
      return {
        ok: false,
        reason: `status=${response.status} ${payload.name ?? ""} ${payload.message ?? ""}`.trim(),
      };
    }

    return { ok: true, id: payload.id ?? "(idなし)" };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "不明なエラー",
    };
  }
}
