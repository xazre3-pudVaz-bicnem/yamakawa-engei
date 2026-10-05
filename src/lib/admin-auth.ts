import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 農園だけが開ける画面（/admin）の合言葉
 *
 * ─────────────────────────────────────────────
 * 仕組み
 * ─────────────────────────────────────────────
 * 環境変数 ADMIN_PASSWORD と照らし合わせ、合っていれば
 * 署名つきのクッキーを配る。クッキーには期限だけを入れ、
 * 合言葉そのものは入れない。
 *
 * 署名の鍵も ADMIN_PASSWORD から作るので、
 * 合言葉を変えれば、配ってあるクッキーはすべて無効になる。
 *
 * ─────────────────────────────────────────────
 * 守っていること
 * ─────────────────────────────────────────────
 * ・合言葉をログに出さない
 * ・比較は timingSafeEqual（1文字ずつ試す攻撃を避ける）
 * ・クッキーは httpOnly（JavaScriptから読めない）
 * ・合言葉が未設定なら、誰も入れない（空の合言葉で開かない）
 */

const COOKIE_NAME = "yk_admin";

/** ログインを保つ時間 */
const SESSION_MS = 12 * 60 * 60 * 1000;

/** 合言葉の間違いを数える時間と回数 */
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const ATTEMPT_LIMIT = 10;

/** 合言葉に必要な長さ */
const PASSWORD_MIN_LENGTH = 8;

function getPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  // 短すぎる合言葉は、設定し忘れと同じ扱いにする
  if (!value || value.length < PASSWORD_MIN_LENGTH) return null;
  return value;
}

/**
 * 合言葉の設定の状態（画面の案内に使う）。
 *
 * 「設定されていない」のか「短すぎる」のかを分けて返す。
 * どちらも同じ案内だと、設定したのに開けない理由が分からないため。
 * 合言葉そのものも、その長さも返さない。
 */
export type AdminConfigState = "ok" | "missing" | "too_short";

export function adminConfigState(): AdminConfigState {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (!value) return "missing";
  if (value.length < PASSWORD_MIN_LENGTH) return "too_short";
  return "ok";
}

/** 合言葉が設定されているか（値は返さない） */
export function isAdminConfigured(): boolean {
  return getPassword() !== null;
}

export { PASSWORD_MIN_LENGTH };

function sign(expiresAt: number, password: string): string {
  return createHmac("sha256", password).update(String(expiresAt)).digest("hex");
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/* ================================================================
   間違いの回数（同じサーバーにある分だけ数える簡易なもの）
================================================================ */

const attempts = new Map<string, { count: number; resetAt: number }>();

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) return false;
  return current.count >= ATTEMPT_LIMIT;
}

function recordAttempt(key: string): void {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return;
  }
  current.count += 1;
}

/* ================================================================
   出入口
================================================================ */

export type LoginResult = { ok: true } | { ok: false; message: string };

/**
 * 合言葉を確かめて、合っていればクッキーを配る。
 * 合言葉そのものはログにも返り値にも出さない。
 */
export async function logIn(input: string, clientKey: string): Promise<LoginResult> {
  const password = getPassword();
  if (!password) {
    return {
      ok: false,
      message: "この画面はまだ使えません（合言葉が設定されていません）。",
    };
  }

  if (tooManyAttempts(clientKey)) {
    return {
      ok: false,
      message: "間違いが続いたため、しばらくお待ちいただいてからお試しください。",
    };
  }

  if (typeof input !== "string" || !equals(input, password)) {
    recordAttempt(clientKey);
    console.warn("[admin] 合言葉が合いませんでした。");
    return { ok: false, message: "合言葉が違います。" };
  }

  const expiresAt = Date.now() + SESSION_MS;
  const store = await cookies();
  store.set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt, password)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
  });

  return { ok: true };
}

/** ログイン済みか */
export async function isLoggedIn(): Promise<boolean> {
  const password = getPassword();
  if (!password) return false;

  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const [rawExpiresAt, signature] = raw.split(".");
  const expiresAt = Number(rawExpiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  if (typeof signature !== "string") return false;

  return equals(signature, sign(expiresAt, password));
}

/** ログアウト */
export async function logOut(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
