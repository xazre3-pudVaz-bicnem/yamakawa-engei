import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { checkoutConfig, UNCONFIRMED_NOTE } from "@/data/siteConfig";
import { RATE_TABLE, SHIPPING as shippingConfig } from "@/data/shipping";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";

/**
 * 配送・送料について（/shipping）
 *
 * ─────────────────────────────────────────────
 * 送料の表示
 * ─────────────────────────────────────────────
 * 料金表は src/data/shipping.ts の RATE_TABLE から作っている。
 * 運賃が改定されたときは、そちらの数値を1箇所直せば、
 * このページ・カート・決済画面・Stripeに渡す送料がすべて同時に変わる。
 *
 * このページに金額をベタ書きしないこと（表と実際の請求額がずれる原因になる）。
 */

export const metadata = buildMetadata({
  title: "配送・送料について",
  description:
    "山川園芸オンラインショップの配送についてのご案内です。クロネコヤマトのクール宅急便で、離島を除く全国へお届けします。地域別の送料と、発送の時期をご案内します。",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipping"
        title="配送・送料について"
        lead="収穫の状況に合わせて、農園から直接お送りしています。"
        crumbs={[{ name: "配送・送料について", path: "/shipping" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {/* ---- 発送について ---- */}
        <Reveal>
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            発送について
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />

          <dl className="mt-10 divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-36 shrink-0 text-moss">発送までの目安</dt>
              <dd className="leading-[1.95]">
                {shippingConfig.dispatchLead}
                <span className="mt-1 block text-moss">
                  {checkoutConfig.deliveryTiming}
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-36 shrink-0 text-moss">配送方法</dt>
              <dd className="leading-[1.95]">
                {shippingConfig.carrier}でお届けします。
              </dd>
            </div>

            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-36 shrink-0 text-moss">お届け日の指定</dt>
              <dd className="leading-[1.95]">
                {shippingConfig.canSpecifyDeliveryDate === null
                  ? "ご希望のある方は、ご注文前にご相談ください。"
                  : shippingConfig.canSpecifyDeliveryDate
                    ? "お届け日をご指定いただけます。"
                    : "収穫の状況に合わせて発送するため、お届け日のご指定は承っておりません。"}
              </dd>
            </div>

            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
              <dt className="w-36 shrink-0 text-moss">お届け地域</dt>
              <dd className="leading-[1.95]">
                {shippingConfig.deliverableArea ?? (
                  <span className="text-moss">
                    確認中です。{UNCONFIRMED_NOTE}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* ---- 送料 ---- */}
        <Reveal className="mt-20">
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            送料
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />

          <div className="mt-10">
            <p className="text-[0.93rem] leading-[2.05] text-ink/85">
              {shippingConfig.policy}
            </p>
            <p className="mt-4 text-[0.93rem] leading-[2.05] text-ink/85">
              送料はお届け先の地域によって変わります。
              下表は<strong className="font-medium">1個口あたり</strong>の金額です。
              ご購入手続きの画面でお届け先をご入力いただくと、
              個口数を掛けた送料と合計金額が自動で表示されます。
            </p>

            {/* 料金表。data/shipping.ts の1箇所を直せばここも変わる。
                スマホでも横スクロールせずに金額が読めるよう、
                幅を固定せず、内訳だけを広い画面で出している。 */}
            <table className="mt-8 w-full border-collapse text-left text-[0.9rem]">
              <caption className="sr-only">
                お届け地域別の送料（60サイズ・クール宅急便・1個口あたり・税込）
              </caption>
              <thead>
                <tr className="border-y border-ink/15">
                  <th scope="col" className="py-4 pr-4 font-normal text-moss">
                    お届け地域
                  </th>
                  <th
                    scope="col"
                    className="w-[7.5rem] py-4 text-right font-normal text-moss sm:w-[13rem]"
                  >
                    1個口あたり
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/12">
                {RATE_TABLE.map((region) => (
                  <tr key={region.id}>
                    <th scope="row" className="py-4 pr-4 align-top font-normal">
                      {region.name}
                      <span className="mt-1 block text-[0.75rem] font-normal leading-[1.75] text-moss">
                        {region.prefectures.join("・")}
                      </span>
                    </th>
                    <td className="tnum py-4 text-right align-top">
                      <span className="font-mincho text-[1.05rem] text-forest">
                        {formatPrice(region.total)}
                      </span>
                      {/* 内訳は画面が狭いと読みにくいので、広い画面でだけ出す */}
                      <span className="mt-1 hidden text-[0.72rem] leading-[1.7] text-moss sm:block">
                        運賃 {formatPrice(region.base)} ＋ クール{" "}
                        {formatPrice(region.cool)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 text-[0.8rem] leading-[1.9] text-moss sm:hidden">
              金額は税込です。ヤマト運輸の宅急便運賃（60サイズ）に、
              クール宅急便の追加料金{formatPrice(RATE_TABLE[0].cool)}を加えています。
            </p>

            <p className="mt-5 text-[0.83rem] leading-[1.9] text-moss">
              ※ 表の金額はヤマト運輸の宅急便運賃（60サイズ・鹿児島県発）に、
              クール宅急便の追加料金を加えたものです。
              運賃が改定された場合は、こちらの表も更新します。
            </p>

            {/* 個口数の考え方を具体例で示す */}
            <div className="mt-8 border border-ink/12 bg-paper-warm px-6 py-6">
              <p className="font-mincho text-[1rem] text-forest">
                送料の計算例
              </p>
              <p className="mt-3 text-[0.88rem] leading-[1.95] text-ink/80">
                生ライチ 500g を2点、350g を1点ご注文の場合は
                <strong className="mx-1 font-medium">3個口</strong>
                となり、上表の金額の3倍が送料になります。
              </p>
              <p className="mt-2 text-[0.83rem] leading-[1.9] text-moss">
                商品は1点ずつ別の箱でお送りするため、まとめ買いでも
                個口数分の送料がかかります。あらかじめご了承ください。
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---- お受け取りについて ---- */}
        <Reveal className="mt-20">
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            お受け取りについてのお願い
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
          <ul className="mt-9 space-y-4 text-[0.92rem] leading-[2] text-ink/80">
            {[
              "生鮮食品です。お届け後はできるだけ早くお受け取りください。",
              "長期のご不在が予想される場合は、ご注文前にご相談ください。",
              "贈り物としてお送りの際は、お届け先の方にひとことお伝えいただけると安心です。",
              "お届けした商品に問題があった場合は、お早めにご連絡ください。",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/guide"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            お買い物ガイド
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
