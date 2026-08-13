import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { checkoutConfig, siteConfig, UNCONFIRMED_NOTE } from "@/data/siteConfig";
import { SHIPPING as shippingConfig, isShippingConfigured } from "@/data/shipping";
import { buildMetadata } from "@/lib/metadata";

/**
 * お買い物ガイド（/guide）
 *
 * 記載内容はすべて data/siteConfig.ts の checkoutConfig / shippingConfig を参照する。
 * 設定を更新すれば、このページと特定商取引法のページが同時に正しくなる。
 * 未確認の項目（送料・日時指定など）は「確認中」と明示し、断定しない。
 */

export const metadata = buildMetadata({
  title: "お買い物ガイド｜ご注文からお届けまで",
  description:
    "山川園芸オンラインショップのご利用方法です。ご注文の流れ、お支払い方法、発送の時期、キャンセル・返品についてご案内します。",
  path: "/guide",
});

const STEPS = [
  {
    index: "01",
    title: "商品を選ぶ",
    body: "オンラインショップから商品をお選びいただき、数量を決めてカートに入れてください。",
  },
  {
    index: "02",
    title: "カートを確認する",
    body: "カートの画面で数量の変更・削除ができます。内容をご確認のうえ、ご購入手続きへお進みください。",
  },
  {
    index: "03",
    title: "お届け先とお支払いを入力する",
    body: "お届け先のご住所とお支払い方法をご入力ください。",
  },
  {
    index: "04",
    title: "ご注文の確定",
    body: "内容をご確認のうえご注文を確定してください。確認のご連絡をお送りします。",
  },
  {
    index: "05",
    title: "お届け",
    body: "収穫の状況に合わせて発送いたします。生鮮食品ですので、お受け取り後はお早めにお召し上がりください。",
  },
];

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Shopping guide"
        title="お買い物ガイド"
        lead="ご注文からお届けまでの流れと、お支払いについてご案内します。"
        crumbs={[{ name: "お買い物ガイド", path: "/guide" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {/* ---- 流れ ---- */}
        <Reveal>
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            ご注文の流れ
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
        </Reveal>

        <ol className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
          {STEPS.map((step) => (
            <Reveal as="li" key={step.index} className="flex gap-6 py-7">
              <span className="font-serif-en text-[0.8rem] tracking-[0.24em] text-lychee-deep">
                {step.index}
              </span>
              <div>
                <h3 className="font-mincho text-[1.05rem] leading-[1.7] text-forest">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.9rem] leading-[1.95] text-ink/80">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* ---- お支払い ---- */}
        <Reveal className="mt-20">
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            お支払いについて
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />

          <dl className="mt-10 divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">お支払い方法</dt>
              <dd>
                <ul className="space-y-1.5">
                  {checkoutConfig.paymentMethods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">お支払い時期</dt>
              <dd className="leading-[1.95]">{checkoutConfig.paymentTiming}</dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">価格の表示</dt>
              <dd className="leading-[1.95]">
                商品ページに表示している価格はすべて税込です。送料は別途かかります。
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">発送の時期</dt>
              <dd className="leading-[1.95]">
                {checkoutConfig.deliveryTiming}
                <span className="mt-1 block text-moss">
                  {shippingConfig.note}
                </span>
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">送料</dt>
              <dd className="leading-[1.95]">
                {isShippingConfigured ? (
                  <>
                    {shippingConfig.carrier}でお届けします。送料は
                    <Link
                      href="/shipping"
                      className="mx-1 text-lychee-deep underline underline-offset-4"
                    >
                      配送・送料について
                    </Link>
                    をご覧ください。ご購入手続きの画面でも合計金額をご確認いただけます。
                  </>
                ) : (
                  <>
                    現在確認中です。{UNCONFIRMED_NOTE}
                    <Link
                      href="/shipping"
                      className="ml-1 text-lychee-deep underline underline-offset-4"
                    >
                      配送・送料について
                    </Link>
                  </>
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">包装・のし</dt>
              <dd className="leading-[1.95]">
                {siteConfig.packagingNote}
                <span className="mt-1 block text-moss">
                  {siteConfig.giftWrapping.note}
                </span>
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 text-moss">
                キャンセル・返品
              </dt>
              <dd className="leading-[1.95]">
                {checkoutConfig.returnPolicy}
                {checkoutConfig.freshnessPolicy && (
                  <span className="mt-2 block">
                    {checkoutConfig.freshnessPolicy}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* ---- 決済について ---- */}
        <Reveal className="mt-14 border border-ink/12 bg-paper-warm px-6 py-7 md:px-8">
          <h2 className="font-mincho text-[1.1rem] text-forest">
            お支払いの安全性について
          </h2>
          <p className="mt-4 text-[0.9rem] leading-[1.95] text-ink/80">
            お支払いは、山川園芸のサイト内でそのままお手続きいただけます。
            カード情報は決済代行会社（Stripe）が直接お預かりし、
            山川園芸のサーバーには保存されません。
          </p>
          <p className="mt-3 text-[0.9rem] leading-[1.95] text-ink/80">
            通信はすべて暗号化されています。
          </p>
        </Reveal>

        <Reveal className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/shipping"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            配送・送料について
          </Link>
          <Link
            href="/legal"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            特定商取引法に基づく表記
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            よくある質問
          </Link>
        </Reveal>
      </div>
    </>
  );
}
