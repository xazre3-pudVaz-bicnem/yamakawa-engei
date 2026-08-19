"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCart } from "./CartProvider";
import { siteConfig } from "@/data/siteConfig";
import { isBuyable } from "@/data/products";
import { SHIPPING } from "@/data/shipping";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

/**
 * Stripe Embedded Checkout
 *
 * ─────────────────────────────────────────────
 * 流れ
 * ─────────────────────────────────────────────
 * 1. カートの中身（商品slugと数量だけ）を /api/checkout に送る
 * 2. サーバーが商品データから金額を組み立てて Checkout Session を作る
 * 3. 返ってきた clientSecret で、このページ内に決済フォームを描画する
 * 4. 決済が終わると Stripe が /order/complete へ戻す
 *
 * 価格はサーバー側でしか決まらないので、
 * ブラウザから金額を書き換えても決済額は変わらない。
 *
 * 公開鍵（NEXT_PUBLIC_...）はブラウザで使ってよいキー。
 * シークレットキーはこのファイルからは触らない。
 */

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";

/** loadStripe はモジュール読み込み時に1度だけ呼ぶ（毎回呼ぶと重い） */
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function StripeCheckout() {
  const { lines, subtotal, totalQuantity, isReady } = useCart();
  const [error, setError] = useState<string | null>(null);
  /** 「もう一度試す」で決済フォームを作り直すためのカウンタ */
  const [attempt, setAttempt] = useState(0);

  // カートの読み込みが終わり、中身があるときだけ決済フォームを描画する
  // （下の早期リターンで判定している）

  /**
   * 決済セッションを作る。
   * Stripeが読み込み時にこの関数を1度だけ呼び、
   * 返した clientSecret でフォームを描画する。
   *
   * カートの中身が確定してから <EmbeddedCheckoutProvider> を描画しているので、
   * ここで参照する lines は最新の内容になっている。
   */
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 送るのは slug と数量だけ。金額は送らない。
      body: JSON.stringify({
        lines: lines.map((line) => ({
          slug: line.product.slug,
          quantity: line.quantity,
        })),
      }),
    });

    const payload: { clientSecret?: string; message?: string } = await response
      .json()
      .catch(() => ({}));

    if (!response.ok || !payload.clientSecret) {
      setError(
        payload.message ??
          "ただいま決済のお手続きを開始できませんでした。お手数ですが、時間をおいてもう一度お試しください。",
      );
      throw new Error("checkout-session-unavailable");
    }

    track("begin_checkout", {
      currency: "JPY",
      value: subtotal ?? 0,
      items: lines.map((line) => ({
        item_id: line.product.id,
        item_name: line.product.name,
        price: line.product.price ?? undefined,
        quantity: line.quantity,
      })),
    });

    return payload.clientSecret;
  }, [lines, subtotal]);

  /**
   * お届け先が入力されたら、サーバーで送料を計算し直す。
   *
   * 送料の金額はここでは扱わない。
   * サーバーが住所と数量から計算し、Stripeのセッションを更新する。
   */
  const onShippingDetailsChange = useCallback(
    async (event: {
      checkoutSessionId: string;
      shippingDetails: unknown;
    }): Promise<{ type: "accept" } | { type: "reject"; errorMessage: string }> => {
      try {
        const response = await fetch("/api/checkout/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkout_session_id: event.checkoutSessionId,
            shipping_details: event.shippingDetails,
          }),
        });

        const result: { type?: string; message?: string } = await response
          .json()
          .catch(() => ({}));

        if (result.type === "error") {
          return {
            type: "reject",
            errorMessage:
              result.message ??
              "送料を計算できませんでした。住所をご確認ください。",
          };
        }

        return { type: "accept" };
      } catch {
        return {
          type: "reject",
          errorMessage:
            "通信に失敗しました。電波の良い場所で、もう一度お試しください。",
        };
      }
    },
    [],
  );

  /** 「もう一度試す」。イベントハンドラなので同期的なsetStateで問題ない */
  function retry() {
    setError(null);
    setAttempt((n) => n + 1);
  }

  /* ---- 公開鍵が無い（設定漏れ）---- */
  if (!stripePromise) {
    return (
      <ErrorPanel message="ただいまオンライン決済をご利用いただけません。お手数ですが、お電話またはお問い合わせよりご連絡ください。" />
    );
  }

  /* ---- カート読み込み中 ---- */
  if (!isReady) {
    return (
      <p className="py-16 text-center text-[0.9rem] text-moss">
        カートを読み込んでいます…
      </p>
    );
  }

  /* ---- カートが空 ---- */
  if (lines.length === 0) {
    return (
      <div className="border border-ink/12 bg-paper-warm px-6 py-16 text-center">
        <p className="font-mincho text-[1.1rem] text-forest">
          カートに商品が入っていません
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-sm tracking-[0.1em] text-paper transition-colors hover:bg-forest-deep"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  /* ---- 買えない商品が入っている ---- */
  // 販売終了後にカートが残っているお客様。
  // Stripeのセッションを作りにいっても断られるので、その前にご案内する。
  const unavailable = lines.filter(({ product }) => !isBuyable(product));
  if (unavailable.length > 0) {
    return (
      <ErrorPanel
        message={`${unavailable
          .map(({ product }) => product.name)
          .join("、")}は、ただいまご購入いただけません。お手数ですが、カートから削除してください。`}
      />
    );
  }

  /* ---- エラー ---- */
  if (error) {
    return <ErrorPanel message={error} onRetry={retry} />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_19rem] lg:items-start lg:gap-14">
      {/* Stripeの決済フォーム。スマホでも横に伸びないよう幅を親に預ける */}
      <div className="min-w-0">
        <EmbeddedCheckoutProvider
          // key を変えると、フォームごと作り直される（「もう一度試す」用）
          key={attempt}
          stripe={stripePromise}
          options={{ fetchClientSecret, onShippingDetailsChange }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>

      {/* ご注文内容（確認用。金額の正はStripe側） */}
      <aside className="border border-ink/12 bg-paper-warm px-6 py-7 lg:sticky lg:top-28">
        <h2 className="font-mincho text-[1.05rem] text-forest">ご注文内容</h2>

        <ul className="mt-5 space-y-4 border-t border-ink/12 pt-5">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.slug} className="flex justify-between gap-4">
              <span className="text-[0.86rem] leading-[1.8]">
                {product.name}
                <span className="tnum ml-2 text-moss">×{quantity}</span>
              </span>
              <span className="tnum shrink-0 text-[0.86rem]">
                {formatPrice(lineTotal) ?? "—"}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-ink/12 pt-5 text-[0.86rem]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">商品点数</dt>
            <dd className="tnum">{totalQuantity}点</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">小計（税込）</dt>
            <dd className="tnum">{formatPrice(subtotal) ?? "—"}</dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-ink/12 pt-5 text-[0.78rem] leading-[1.85] text-moss">
          送料は左のお支払い画面でお選びいただき、合計に加算されます。
          {SHIPPING.carrier}でお届けします。
        </p>

        <Link
          href="/cart"
          className="mt-6 inline-block text-[0.83rem] text-moss underline underline-offset-4 hover:text-forest"
        >
          カートを修正する
        </Link>
      </aside>
    </div>
  );
}

/** エラー表示。内部の詳細は出さず、次にとれる行動を添える */
function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border border-lychee/40 bg-lychee-soft/30 px-6 py-8 md:px-8">
      <p className="font-mincho text-[1.05rem] text-lychee-deep">
        お手続きを進められませんでした
      </p>
      <p className="mt-4 text-[0.92rem] leading-[2] text-ink/85">{message}</p>

      <div className="mt-7 flex flex-wrap gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center border border-forest bg-forest px-7 py-3 text-[0.88rem] tracking-[0.08em] text-paper transition-colors hover:bg-forest-deep"
          >
            もう一度試す
          </button>
        )}
        <Link
          href="/cart"
          className="inline-flex items-center justify-center border border-ink/20 px-7 py-3 text-[0.88rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
        >
          カートに戻る
        </Link>
      </div>

      <p className="mt-6 text-[0.85rem] leading-[1.95] text-moss">
        お急ぎの場合は、お電話でもご注文を承ります。
        <a
          href={siteConfig.phoneHref}
          className="ml-1 text-lychee-deep underline underline-offset-4 hover:text-lychee"
        >
          {siteConfig.phone}
        </a>
        （{siteConfig.phoneNote}）
      </p>
    </div>
  );
}
