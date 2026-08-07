import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  checkoutConfig,
  contactConfig,
  shippingConfig,
  siteConfig,
} from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";

/**
 * 特定商取引法に基づく表記（/legal）
 *
 * ─────────────────────────────────────────────
 * 重要
 * ─────────────────────────────────────────────
 * ECサイトの必須ページです。value が null の項目は
 * 「確認中」と表示され、内容が未確定であることが読み手にも分かります。
 * 推測で埋めないこと。data/siteConfig.ts に値を入れると自動で反映されます。
 *
 * お支払い方法・引渡し時期・返品についての記載は、現在
 * 公式オンラインショップ（BASE）で公開されている内容にもとづいています。
 * 本サイトで自社決済（Stripe等）を始めるときは、必ず内容を見直してください。
 *
 * 未確定のまま残っている項目（開業前に必ず確定させること）
 *   ・メールアドレス（連絡先として公開できるもの）
 *   ・送料
 *   ・生鮮品の品質に関する対応（傷み・輸送事故時の連絡期限と対応）
 *   ・商品代金以外の必要料金（振込手数料・代引手数料など）
 */

export const metadata = buildMetadata({
  title: "特定商取引法に基づく表記",
  description:
    "山川園芸オンラインショップの特定商取引法に基づく表記です。販売事業者・所在地・お支払い方法・返品についてご案内します。",
  path: "/legal",
});

type Row = {
  term: string;
  /** null は「未確定」。画面には「確認中」と出る */
  value: string | null;
  note?: string;
};

export default function LegalPage() {
  const rows: Row[] = [
    { term: "販売事業者", value: siteConfig.name },
    { term: "運営統括責任者", value: siteConfig.owner },
    {
      term: "所在地",
      value: siteConfig.address.postalCode
        ? `〒${siteConfig.address.postalCode}　${siteConfig.address.full}`
        : siteConfig.address.full,
    },
    {
      term: "電話番号",
      value: siteConfig.phone,
      note: `受付時間 ${siteConfig.hoursSummary}／${siteConfig.busySeasonNote}`,
    },
    {
      term: "メールアドレス",
      value: contactConfig.email,
      note: "お問い合わせは、お電話または公式オンラインショップのお問い合わせフォームより承ります。",
    },
    {
      term: "ホームページ",
      value: siteConfig.externalShop.url,
    },
    {
      term: "販売価格",
      value:
        "各商品ページに表示された価格（税込）によります。商品代金のほかに送料がかかります。",
    },
    {
      term: "商品代金以外の必要料金",
      value:
        shippingConfig.type === "unconfirmed"
          ? null
          : "送料（配送・送料についてのページに記載）。お支払い方法により、別途手数料がかかる場合があります。",
      note:
        shippingConfig.type === "unconfirmed"
          ? "送料および各種手数料は確認中です。確定しだい掲載します。"
          : undefined,
    },
    {
      term: "お支払い方法",
      value: checkoutConfig.paymentMethods.join("／"),
    },
    {
      term: "お支払い時期",
      value: checkoutConfig.paymentTiming,
    },
    {
      term: "商品の引渡し時期",
      value: checkoutConfig.deliveryTiming,
      note: shippingConfig.note,
    },
    {
      term: "返品・交換・キャンセル",
      value: checkoutConfig.returnPolicy,
      note: "生鮮食品のため、お客様のご都合による返品・交換はお受けできません。",
    },
    {
      term: "商品に不備があった場合",
      value: checkoutConfig.freshnessPolicy,
      note: "お届けした商品に問題があった場合は、お早めにご連絡ください。",
    },
    {
      term: "販売数量",
      value:
        "収穫できる量に限りがあるため、販売数量に達しだい受付を終了します。",
    },
    {
      term: "引渡し可能地域",
      value: shippingConfig.deliverableArea,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="特定商取引法に基づく表記"
        crumbs={[{ name: "特定商取引法に基づく表記", path: "/legal" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <dl className="divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
            {rows.map((row) => (
              <div
                key={row.term}
                className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8"
              >
                <dt className="w-48 shrink-0 text-moss">{row.term}</dt>
                <dd className="leading-[1.95]">
                  {row.value ? (
                    row.value
                  ) : (
                    <span className="text-moss">確認中です。</span>
                  )}
                  {row.note && (
                    <span className="mt-1.5 block text-[0.83rem] text-moss">
                      {row.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 text-[0.85rem] leading-[1.95] text-moss">
          <p>
            「確認中」と記載している項目は、内容が確定しだい掲載します。
            お急ぎの場合は
            <Link
              href="/contact"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              お問い合わせ
            </Link>
            よりご連絡ください。
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/guide"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            お買い物ガイド
          </Link>
          <Link
            href="/shipping"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            配送・送料について
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            プライバシーポリシー
          </Link>
        </Reveal>
      </div>
    </>
  );
}
