"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { checkoutConfig, shippingConfig, siteConfig } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

/**
 * ご購入手続き
 *
 * ─────────────────────────────────────────────
 * 3つのモード（data/siteConfig.ts の checkoutConfig.provider）
 * ─────────────────────────────────────────────
 * "external" … カートの内容を確認したうえで、実際にご注文を受け付けている
 *               公式オンラインショップ（BASE）へ引き継ぐ。
 *               ＝ 決済が未接続でも、お客様が確実に購入までたどり着ける。
 * "stripe"   … /api/checkout に注文内容を送り、Stripe Checkout へ遷移する。
 *               STRIPE_SECRET_KEY を設定し、api/checkout/route.ts の
 *               TODO を実装すると有効になる。
 * "inquiry"  … 注文内容をお問い合わせとして受け付ける。
 *
 * 送料が未確定のあいだ、合計欄に架空の送料を足さない。
 */
export default function CheckoutPanel() {
  const { lines, subtotal, totalQuantity, isReady } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return (
      <p className="py-16 text-center text-[0.9rem] text-moss">
        カートを読み込んでいます…
      </p>
    );
  }

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

  /** 引き継ぎ先。商品ごとのページが分かっていればそちらへ */
  const externalHref =
    lines.length === 1 && lines[0].product.externalUrl
      ? lines[0].product.externalUrl
      : siteConfig.externalShop.url;

  async function startStripeCheckout() {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 価格はサーバー側で商品データから引き直す。
        // クライアントから送られた金額は信用しない。
        body: JSON.stringify({
          lines: lines.map((line) => ({
            slug: line.product.slug,
            quantity: line.quantity,
          })),
        }),
      });

      const payload: { url?: string; message?: string } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && payload.url) {
        window.location.href = payload.url;
        return;
      }
      setError(
        payload.message ??
          "ただいまオンライン決済をご利用いただけません。お手数ですが、お電話またはお問い合わせよりご連絡ください。",
      );
    } catch {
      setError(
        "通信に失敗しました。時間をおいて、もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16">
      {/* ---- 手続きの案内 ---- */}
      <div>
        {checkoutConfig.provider === "external" && (
          <section>
            <h2 className="font-mincho text-[1.3rem] leading-snug text-forest">
              ご注文は公式オンラインショップで承ります
            </h2>
            <p className="mt-5 text-[0.93rem] leading-[2.05] text-ink/85">
              お支払いとご注文の受付は、山川園芸の公式オンラインショップ（
              {siteConfig.externalShop.platform}
              ）で行っています。下のボタンからお進みいただき、
              こちらのカートと同じ内容をご注文ください。
            </p>

            <ol className="mt-8 space-y-5 border-t border-ink/12 pt-8">
              {[
                "「公式オンラインショップへ進む」を押します",
                "同じ商品・同じ数量をカートに入れます",
                "お届け先とお支払い方法を入力してご注文を確定します",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-serif-en text-sm text-lychee-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.92rem] leading-[1.95] text-ink/85">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-9">
              <a
                href={externalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center border border-lychee bg-lychee px-8 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep sm:w-auto"
              >
                公式オンラインショップへ進む
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </div>

            <p className="mt-6 text-[0.83rem] leading-[1.95] text-moss">
              お電話でのご注文も承ります。
              <a
                href={siteConfig.phoneHref}
                className="ml-1 text-lychee-deep underline underline-offset-4 hover:text-lychee"
              >
                {siteConfig.phone}
              </a>
              （{siteConfig.phoneNote}）
            </p>
          </section>
        )}

        {checkoutConfig.provider === "stripe" && (
          <section>
            <h2 className="font-mincho text-[1.3rem] leading-snug text-forest">
              お支払いへ進む
            </h2>
            <p className="mt-5 text-[0.93rem] leading-[2.05] text-ink/85">
              このあとの画面で、お届け先とお支払い方法をご入力いただきます。
              入力内容は決済代行会社の安全な画面で取り扱われます。
            </p>
            <button
              type="button"
              onClick={startStripeCheckout}
              disabled={isSubmitting}
              className="mt-8 inline-flex w-full items-center justify-center border border-lychee bg-lychee px-8 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "画面を準備しています…" : "お支払いへ進む"}
            </button>
            <div aria-live="polite">
              {error && (
                <p className="mt-5 border border-lychee/40 bg-lychee-soft/40 px-5 py-4 text-[0.88rem] leading-[1.9] text-lychee-deep">
                  {error}
                </p>
              )}
            </div>
          </section>
        )}

        {checkoutConfig.provider === "inquiry" && (
          <section>
            <h2 className="font-mincho text-[1.3rem] leading-snug text-forest">
              ご注文内容をお送りください
            </h2>
            <p className="mt-5 text-[0.93rem] leading-[2.05] text-ink/85">
              下記の内容でお問い合わせフォームからご連絡いただければ、
              農園より折り返しご案内いたします。
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex w-full items-center justify-center border border-lychee bg-lychee px-8 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep sm:w-auto"
            >
              お問い合わせへ進む
            </Link>
          </section>
        )}

        <div className="mt-12 border-t border-ink/12 pt-8 text-[0.83rem] leading-[1.95] text-moss">
          <p>
            ご注文の前に
            <Link
              href="/guide"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              お買い物ガイド
            </Link>
            と
            <Link
              href="/legal"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              特定商取引法に基づく表記
            </Link>
            をご確認ください。
          </p>
          <p className="mt-2">{shippingConfig.note}</p>
        </div>
      </div>

      {/* ---- ご注文内容 ---- */}
      <aside className="border border-ink/12 bg-paper-warm px-6 py-7 lg:sticky lg:top-28">
        <h2 className="font-mincho text-[1.1rem] text-forest">ご注文内容</h2>

        <ul className="mt-5 space-y-4 border-t border-ink/12 pt-5">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.slug} className="flex justify-between gap-4">
              <span className="text-[0.88rem] leading-[1.8]">
                {product.name}
                <span className="tnum ml-2 text-moss">×{quantity}</span>
              </span>
              <span className="tnum shrink-0 text-[0.88rem]">
                {formatPrice(lineTotal) ?? "—"}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-ink/12 pt-5 text-[0.88rem]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">商品点数</dt>
            <dd className="tnum">{totalQuantity}点</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">小計（税込）</dt>
            <dd className="tnum">{formatPrice(subtotal) ?? "—"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-moss">送料</dt>
            <dd className="text-[0.85rem]">
              {shippingConfig.type === "unconfirmed"
                ? "別途"
                : (formatPrice(shippingConfig.flatFee) ?? "別途")}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink/12 pt-5">
          <span className="text-[0.9rem] text-moss">合計</span>
          <span className="tnum font-mincho text-[1.3rem] text-forest">
            {formatPrice(subtotal) ?? "—"}
          </span>
        </div>

        <p className="mt-4 text-[0.75rem] leading-[1.85] text-moss">
          小計は税込です。送料は含まれていません。
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
