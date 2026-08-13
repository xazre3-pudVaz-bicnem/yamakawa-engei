import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import { getStripe } from "@/lib/stripe";
import { SHIPPING } from "@/data/shipping";
import { siteConfig } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

/**
 * 注文完了（/order/complete）
 *
 * ─────────────────────────────────────────────
 * 表示の考え方
 * ─────────────────────────────────────────────
 * Stripeから戻ってきた session_id を使い、サーバー側でセッションを取得して
 * 内容を表示する。クライアントから渡された金額は一切信用しない。
 *
 * 表示するのは、お客様ご本人に見せて問題のない情報だけ。
 * PaymentIntentのIDや内部の識別子はブラウザへ出さない。
 *
 * また、このページの表示は「注文が確定した」ことの正式な判定ではない。
 * 正式な確定はWebhook（api/stripe/webhook）で受け取る。
 * お客様が完了画面を閉じてしまっても、注文はStripe側に残る。
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ご注文ありがとうございました",
  description: "ご注文を承りました。",
  alternates: { canonical: "/order/complete" },
  openGraph: { url: "/order/complete" },
  robots: { index: false, follow: false },
};

/** 注文番号として見せる文字列。Stripeの内部IDをそのままは出さない */
function orderNumber(session: Stripe.Checkout.Session): string {
  // cs_live_a1b2c3... の末尾8文字を大文字にして、お問い合わせ用の番号にする
  return session.id.slice(-8).toUpperCase();
}

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();

  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Stripe.LineItem[] = [];

  if (stripe && sessionId && sessionId.startsWith("cs_")) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
      lineItems = session.line_items?.data ?? [];
    } catch (error) {
      // 存在しないIDや期限切れ。お客様には一般的な案内を出す
      console.error("[order/complete] セッションを取得できませんでした:", error);
      session = null;
    }
  }

  const isPaid = session?.payment_status === "paid";

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
      <Breadcrumbs items={[{ name: "ご注文完了", path: "/order/complete" }]} />

      {isPaid && session ? (
        <>
          {/* 支払いが確認できたときだけカートを空にする */}
          <ClearCartOnMount />

          <header className="mt-8">
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Thank you
            </p>
            <h1 className="mt-5 font-mincho text-[1.7rem] leading-snug text-forest md:text-[2.1rem]">
              ご注文ありがとうございました
            </h1>
            <span
              aria-hidden="true"
              className="mt-7 block h-px w-16 bg-leaf/60"
            />
            <p className="mt-7 text-[0.95rem] leading-[2.05] text-ink/85">
              ご注文を承りました。
              ご入力いただいたメールアドレス宛に、確認のメールをお送りしています。
            </p>
          </header>

          {/* ご注文内容 */}
          <section className="mt-12 border border-ink/12 bg-paper-warm px-6 py-7 md:px-8">
            <h2 className="font-mincho text-[1.1rem] text-forest">ご注文内容</h2>

            <dl className="mt-6 space-y-3 border-b border-ink/12 pb-6 text-[0.9rem]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-moss">注文番号</dt>
                <dd className="tnum font-mincho text-[1.05rem] text-forest">
                  {orderNumber(session)}
                </dd>
              </div>
              {session.customer_details?.email && (
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-moss">メールアドレス</dt>
                  <dd className="break-all">
                    {session.customer_details.email}
                  </dd>
                </div>
              )}
            </dl>

            {lineItems.length > 0 && (
              <ul className="mt-6 space-y-3">
                {lineItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-4 text-[0.9rem]"
                  >
                    <span className="leading-[1.8]">
                      {item.description}
                      <span className="tnum ml-2 text-moss">
                        ×{item.quantity ?? 1}
                      </span>
                    </span>
                    <span className="tnum shrink-0">
                      {formatPrice(item.amount_total)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-6 space-y-3 border-t border-ink/12 pt-6 text-[0.9rem]">
              {session.total_details?.amount_shipping !== undefined && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-moss">送料</dt>
                  <dd className="tnum">
                    {formatPrice(session.total_details.amount_shipping)}
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4 border-t border-ink/12 pt-3">
                <dt className="text-moss">お支払い金額（税込）</dt>
                <dd className="tnum font-mincho text-[1.3rem] text-forest">
                  {formatPrice(session.amount_total)}
                </dd>
              </div>
            </dl>
          </section>

          {/* このあとの流れ */}
          <section className="mt-12">
            <h2 className="font-mincho text-[1.15rem] text-forest">
              このあとの流れ
            </h2>
            <ol className="mt-6 divide-y divide-ink/12 border-y border-ink/12">
              {[
                {
                  title: "確認メールをご確認ください",
                  body: "ご入力いただいたメールアドレス宛に、ご注文内容の確認メールが届きます。届かない場合は、迷惑メールフォルダもご確認ください。",
                },
                {
                  title: "農園から発送します",
                  body: `${SHIPPING.dispatchLead}いたします。${SHIPPING.carrier}でお届けします。${SHIPPING.note}`,
                },
                {
                  title: "届いたら冷蔵庫へ",
                  body: "生鮮食品です。お受け取りのあとは冷蔵庫で保存し、お早めにお召し上がりください。",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-5 py-6">
                  <span
                    aria-hidden="true"
                    className="font-serif-en text-[0.78rem] tracking-[0.24em] text-lychee-deep"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-mincho text-[1.02rem] leading-[1.7] text-forest">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9rem] leading-[1.95] text-ink/80">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <h2 className="font-mincho text-[1.15rem] text-forest">
              お召し上がりになる前に
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9rem] leading-[1.95] text-ink/80">
              <li>
                <Link
                  href="/lychee/how-to-eat"
                  className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
                >
                  ライチの皮のむき方と種の取り方を見る
                </Link>
              </li>
              <li>
                <Link
                  href="/lychee/storage"
                  className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
                >
                  届いたライチの保存方法と日持ちを見る
                </Link>
              </li>
            </ul>
          </section>

          <p className="mt-12 text-[0.85rem] leading-[1.95] text-moss">
            ご注文についてのお問い合わせは、注文番号をお伝えのうえ
            <Link
              href="/contact"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              お問い合わせ
            </Link>
            またはお電話（
            <a
              href={siteConfig.phoneHref}
              className="text-lychee-deep underline underline-offset-4"
            >
              {siteConfig.phone}
            </a>
            ）よりご連絡ください。
          </p>
        </>
      ) : (
        /* ---- 支払いが確認できないとき ---- */
        <>
          <header className="mt-8">
            <h1 className="font-mincho text-[1.6rem] leading-snug text-forest md:text-[2rem]">
              ご注文内容を確認できませんでした
            </h1>
            <span
              aria-hidden="true"
              className="mt-7 block h-px w-16 bg-leaf/60"
            />
            <p className="mt-7 text-[0.95rem] leading-[2.05] text-ink/85">
              このページは、お支払いが完了したあとに表示されます。
              お手続きの途中だった場合は、カートからもう一度お進みください。
            </p>
            <p className="mt-4 text-[0.9rem] leading-[2] text-moss">
              すでにお支払いをお済ませの場合は、確認のメールが届いているかご確認ください。
              ご不明な点は、お手数ですがお問い合わせください。
            </p>
          </header>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors hover:bg-forest-deep"
            >
              カートを見る
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
            >
              お問い合わせ
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
