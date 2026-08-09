import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { checkoutConfig, shippingConfig, UNCONFIRMED_NOTE } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";

/**
 * 配送・送料について（/shipping）
 *
 * ─────────────────────────────────────────────
 * 送料の表示
 * ─────────────────────────────────────────────
 * data/siteConfig.ts の shippingConfig を書き換えるだけで、
 * このページ・カート・購入手続き・お買い物ガイドの表示がすべて揃う。
 *
 *   現在（"external"）:
 *     金額は公式オンラインショップに掲載。ここでは掲載先を案内するだけ。
 *     二重に載せて食い違うことを避けるための設定。
 *   全国一律にするとき:
 *     type: "flat", flatFee: 1000
 *   地域別にするとき:
 *     type: "by_region", regions: [{ name: "九州", fee: 900 }, ...]
 *   送料無料のとき:
 *     type: "free"
 *   未確定に戻すとき:
 *     type: "unconfirmed"（金額を出さず「確認中」と表示する）
 *
 * 架空の送料は載せない。
 */

export const metadata = buildMetadata({
  title: "配送・送料について",
  description:
    "山川園芸オンラインショップの配送についてのご案内です。発送の時期、お届けまでの日数、送料についてご説明します。",
  path: "/shipping",
});

export default function ShippingPage() {
  const isFlat = shippingConfig.type === "flat";
  const isByRegion = shippingConfig.type === "by_region";
  const isFree = shippingConfig.type === "free";
  const isUnconfirmed = shippingConfig.type === "unconfirmed";
  /** 金額は公式オンラインショップに掲載し、こちらからは案内だけを出す */
  const isExternal = shippingConfig.type === "external";

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
            {isExternal && (
              <div className="border border-ink/12 bg-paper-warm px-6 py-7">
                <p className="text-[0.92rem] leading-[2] text-ink/80">
                  送料は、公式オンラインショップの各商品ページにある
                  「送料・配送方法について」に掲載しています。
                  ご注文手続きの画面でもご確認いただけます。
                </p>
                <a
                  href={shippingConfig.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
                >
                  公式オンラインショップで送料を見る
                  <span className="sr-only">（新しいタブで開きます）</span>
                </a>
              </div>
            )}

            {isUnconfirmed && (
              <div className="border border-ink/12 bg-paper-warm px-6 py-7">
                <p className="text-[0.92rem] leading-[2] text-ink/80">
                  送料は現在確認中です。金額が決まりしだい、こちらでご案内します。
                  お急ぎの場合は、お手数ですがお問い合わせよりご確認ください。
                </p>
                <p className="mt-5">
                  <Link
                    href="/contact"
                    className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                  >
                    送料について問い合わせる
                  </Link>
                </p>
              </div>
            )}

            {isFree && (
              <p className="text-[0.95rem] leading-[2] text-ink/85">
                送料は当園が負担いたします。
              </p>
            )}

            {isFlat && (
              <p className="text-[0.95rem] leading-[2] text-ink/85">
                全国一律{" "}
                <span className="tnum font-mincho text-[1.25rem] text-forest">
                  {formatPrice(shippingConfig.flatFee)}
                </span>
                （税込）
              </p>
            )}

            {isByRegion && shippingConfig.regions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[24rem] border-collapse text-left text-[0.9rem]">
                  <caption className="sr-only">地域別の送料</caption>
                  <thead>
                    <tr className="border-y border-ink/15">
                      <th scope="col" className="py-4 pr-6 font-normal text-moss">
                        お届け地域
                      </th>
                      <th scope="col" className="py-4 font-normal text-moss">
                        送料（税込）
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/12">
                    {shippingConfig.regions.map((region) => (
                      <tr key={region.name}>
                        <th scope="row" className="py-4 pr-6 font-normal">
                          {region.name}
                        </th>
                        <td className="tnum py-4">{formatPrice(region.fee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {shippingConfig.freeShippingThreshold !== null && (
              <p className="mt-5 text-[0.88rem] text-moss">
                {formatPrice(shippingConfig.freeShippingThreshold)}
                以上のお買い上げで送料無料になります。
              </p>
            )}
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
