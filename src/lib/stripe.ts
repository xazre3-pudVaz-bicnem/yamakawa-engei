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
 * ★キーの値そのものは、ログにも画面にも絶対に出さない★
 * 調査に必要なのは「形が正しいか」「本番用か」だけなので、
 * 長さ・接頭辞・文字種といった形の情報だけを出す。
 *
 * ─────────────────────────────────────────────
 * 環境変数
 * ─────────────────────────────────────────────
 * STRIPE_SECRET_KEY                   … 必須。サーバー側でのみ使用
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  … ブラウザで使う公開鍵
 * STRIPE_WEBHOOK_SECRET               … Webhookの署名検証に使用
 */

/** シークレットキー（sk_）と制限付きキー（rk_）の形 */
const SECRET_KEY_PATTERN = /^(?:sk|rk)_(?:live|test)_[A-Za-z0-9]+$/;
/** 公開鍵の形 */
const PUBLISHABLE_KEY_PATTERN = /^pk_(?:live|test)_[A-Za-z0-9]+$/;

export type KeyMode = "live" | "test" | "unknown";

/**
 * キーの「形」だけを取り出したもの。値は含めない。
 * ここに入っている情報だけがログに出してよい情報。
 */
export type KeyShape = {
  present: boolean;
  /** 形が正しいか（伏せ字をそのままコピーした値などを弾く） */
  wellFormed: boolean;
  mode: KeyMode;
  length: number;
  /** sk_live_ などの接頭辞まで */
  prefix: string;
  /** 英数字とアンダースコア以外が混ざっていないか */
  hasUnexpectedChars: boolean;
  /** 前後に空白・改行が付いていたか */
  hadSurroundingWhitespace: boolean;
  /**
   * アカウント識別子（新しい形式の "51XXXXXX" の部分）。
   * 同じ値が公開鍵にも入っていて、公開鍵はブラウザに出ている情報なので、
   * これをログに出しても秘密は漏れない。
   */
  account: string | null;
};

function inspectKey(raw: string | undefined, pattern: RegExp): KeyShape {
  const original = raw ?? "";
  const value = original.trim();

  if (!value) {
    return {
      present: false,
      wellFormed: false,
      mode: "unknown",
      length: 0,
      prefix: "",
      hasUnexpectedChars: false,
      hadSurroundingWhitespace: false,
      account: null,
    };
  }

  const prefixMatch = value.match(/^(?:sk|rk|pk)_(?:live|test)_/);
  const accountMatch = value.match(
    /^(?:sk|rk|pk)_(?:live|test)_(51[A-Za-z0-9]{6})/,
  );

  return {
    present: true,
    wellFormed: pattern.test(value),
    mode: value.includes("_live_")
      ? "live"
      : value.includes("_test_")
        ? "test"
        : "unknown",
    length: value.length,
    prefix: prefixMatch ? prefixMatch[0] : value.slice(0, 3),
    hasUnexpectedChars: !/^[A-Za-z0-9_]+$/.test(value),
    hadSurroundingWhitespace: original !== value,
    account: accountMatch ? accountMatch[1] : null,
  };
}

/** シークレットキーの形（値は含まない） */
export function getSecretKeyShape(): KeyShape {
  return inspectKey(process.env.STRIPE_SECRET_KEY, SECRET_KEY_PATTERN);
}

/** 公開鍵の形（値は含まない） */
export function getPublishableKeyShape(): KeyShape {
  return inspectKey(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    PUBLISHABLE_KEY_PATTERN,
  );
}

/**
 * 本番キーとテストキーが混ざっていないか、
 * 2つのキーが同じStripeアカウントのものかを調べる。
 */
export function getKeyPairDiagnostics() {
  const secret = getSecretKeyShape();
  const publishable = getPublishableKeyShape();

  return {
    secret,
    publishable,
    /** 片方が本番、もう片方がテスト */
    modeMismatch:
      secret.mode !== "unknown" &&
      publishable.mode !== "unknown" &&
      secret.mode !== publishable.mode,
    /** 別々のStripeアカウントのキーが入っている */
    accountMismatch:
      secret.account !== null &&
      publishable.account !== null &&
      secret.account !== publishable.account,
  };
}

/** ログに出してよい形の要約（値は一切含まない） */
export function describeKeyShape(name: string, shape: KeyShape): string {
  if (!shape.present) return `${name}=未設定`;
  return [
    `${name}=設定あり`,
    `mode=${shape.mode}`,
    `prefix=${shape.prefix}`,
    `length=${shape.length}`,
    `wellFormed=${shape.wellFormed}`,
    shape.hasUnexpectedChars ? "英数字以外の文字あり" : null,
    shape.hadSurroundingWhitespace ? "前後に空白あり" : null,
  ]
    .filter(Boolean)
    .join(" ");
}

let cached: Stripe | null = null;
let warnedKey = "";

/**
 * Stripe クライアントを取得する。
 * キーが未設定、または形が明らかにおかしいときは null を返すので、
 * 呼び出し側で「ただいま決済をご利用いただけません」と案内できる。
 */
export function getStripe(): Stripe | null {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const shape = getSecretKeyShape();

  if (!secretKey || !shape.present) {
    warnOnce("missing", "STRIPE_SECRET_KEY が設定されていません。");
    return null;
  }

  // 伏せ字をそのままコピーした値・改行の混入・途中で切れた値をここで弾く。
  // Stripeに投げても401になるだけなので、手前で止めて原因が分かるようにする。
  if (!shape.wellFormed) {
    warnOnce(
      "malformed",
      `STRIPE_SECRET_KEY の形が正しくありません。${describeKeyShape("secret", shape)}`,
    );
    return null;
  }

  const pair = getKeyPairDiagnostics();
  if (pair.modeMismatch) {
    warnOnce(
      "mode",
      `本番キーとテストキーが混在しています。secret=${pair.secret.mode} publishable=${pair.publishable.mode}`,
    );
  }
  if (pair.accountMismatch) {
    warnOnce(
      "account",
      `シークレットキーと公開鍵が別のStripeアカウントのものです。secret=${pair.secret.account} publishable=${pair.publishable.account}`,
    );
  }

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

/** 同じ警告でログを埋めないように、種類ごとに1回だけ出す */
function warnOnce(kind: string, message: string): void {
  if (warnedKey.includes(`|${kind}|`)) return;
  warnedKey += `|${kind}|`;
  console.error(`[stripe] ${message}`);
}

/** 決済が使える状態か（キーが設定され、形も正しいか） */
export function isStripeConfigured(): boolean {
  const shape = getSecretKeyShape();
  return shape.present && shape.wellFormed;
}

/* ================================================================
   エラーの記録
================================================================ */

/** ログに出してよいエラー情報。キーや個人情報は含まない */
export type StripeErrorInfo = {
  type: string;
  code: string;
  message: string;
  requestId: string;
  statusCode: number | null;
  /** どのパラメータが原因か（Stripeが教えてくれる場合） */
  param: string | null;
  /** キーそのものが拒否された（401）か */
  isAuthError: boolean;
};

/**
 * Stripeのエラーから、ログに出す項目だけを取り出す。
 *
 * type / code / message / requestId のみ。
 * スタックトレースやレスポンスヘッダーは出さない。
 */
export function describeStripeError(error: unknown): StripeErrorInfo {
  const raw = error as {
    type?: unknown;
    code?: unknown;
    message?: unknown;
    requestId?: unknown;
    statusCode?: unknown;
    param?: unknown;
  };

  const type =
    typeof raw?.type === "string"
      ? raw.type
      : error instanceof Error
        ? error.name
        : "UnknownError";
  const statusCode =
    typeof raw?.statusCode === "number" ? raw.statusCode : null;

  return {
    type,
    code: typeof raw?.code === "string" ? raw.code : "(なし)",
    message:
      typeof raw?.message === "string"
        ? raw.message
        : error instanceof Error
          ? error.message
          : "(メッセージなし)",
    requestId: typeof raw?.requestId === "string" ? raw.requestId : "(なし)",
    statusCode,
    param: typeof raw?.param === "string" ? raw.param : null,
    isAuthError: type === "StripeAuthenticationError" || statusCode === 401,
  };
}

/**
 * Stripeのエラーをサーバーログに1行で残す。
 *
 * Vercelのログに出るのは type / code / message / requestId / status のみ。
 * 認証エラーのときだけ、対処が分かるように追加の1行を出す。
 */
export function logStripeError(scope: string, error: unknown): StripeErrorInfo {
  const info = describeStripeError(error);

  console.error(
    `[${scope}] Stripe error` +
      ` type=${info.type}` +
      ` code=${info.code}` +
      ` status=${info.statusCode ?? "-"}` +
      ` requestId=${info.requestId}` +
      (info.param ? ` param=${info.param}` : "") +
      ` message=${info.message}`,
  );

  if (info.isAuthError) {
    const pair = getKeyPairDiagnostics();
    console.error(
      `[${scope}] STRIPE_SECRET_KEY がStripeに拒否されました（401）。` +
        `Stripeダッシュボードでキーを再発行し、Vercelの環境変数を入れ替えて再デプロイしてください。` +
        ` ${describeKeyShape("secret", pair.secret)}` +
        ` / ${describeKeyShape("publishable", pair.publishable)}` +
        ` / modeMismatch=${pair.modeMismatch}` +
        ` / accountMismatch=${pair.accountMismatch}`,
    );
  }

  return info;
}
