import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { siteConfig, UNCONFIRMED_NOTE } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";

/**
 * 農園情報・アクセス（/access）
 *
 * ローカルSEOの受け皿。地域名（鹿児島県・指宿市・山川）を
 * 見出しと本文に自然に含める。
 *
 * [TODO] 農園での直売・見学の可否、駐車場の有無は未確認。
 * 「できます」とも「できません」とも書かず、電話での確認を案内している。
 */

export const metadata = buildMetadata({
  title: "農園情報・アクセス｜鹿児島県指宿市山川",
  description:
    "山川園芸の所在地は鹿児島県指宿市山川新生町101。薩摩半島最南端の指宿市山川にあるライチ農園です。連絡先・受付時間・地図をご案内します。",
  path: "/access",
  keywords: ["山川園芸 場所", "指宿 ライチ 農園", "指宿市 山川", "鹿児島 ライチ"],
});

export default function AccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Access"
        title={
          <>
            鹿児島県指宿市山川。
            <br className="hidden sm:block" />
            薩摩半島の、いちばん南。
          </>
        }
        lead="三方を海に囲まれた指宿市山川で、ライチをはじめとする熱帯果樹を育てています。"
        crumbs={[{ name: "農園情報・アクセス", path: "/access" }]}
      />

      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* ---- 農園情報 ---- */}
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
              農園情報
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />

            <dl className="mt-9 divide-y divide-ink/12 border-y border-ink/12 text-[0.9rem]">
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">屋号</dt>
                <dd>{siteConfig.name}</dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">代表者</dt>
                <dd>{siteConfig.owner}</dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">所在地</dt>
                <dd>
                  <a
                    href={siteConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-forest"
                  >
                    {siteConfig.address.full}
                  </a>
                  <span className="sr-only">（Googleマップを新しいタブで開きます）</span>
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">電話</dt>
                <dd>
                  <a
                    href={siteConfig.phoneHref}
                    className="underline underline-offset-4 hover:text-forest"
                  >
                    {siteConfig.phone}
                  </a>
                  <span className="mt-1 block text-[0.83rem] text-moss">
                    {siteConfig.phoneNote}
                  </span>
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">受付時間</dt>
                <dd>
                  {siteConfig.hoursSummary}
                  <span className="mt-1 block text-[0.83rem] text-moss">
                    {siteConfig.busySeasonNote}
                  </span>
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">定休日</dt>
                <dd>{siteConfig.closedDays}</dd>
              </div>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-24 shrink-0 text-moss">店頭</dt>
                <dd>
                  {siteConfig.retailPartners.map((partner) => (
                    <span key={partner.name} className="block leading-[1.9]">
                      {partner.name}
                      <span className="text-moss">（{partner.note}）</span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-8 border border-ink/12 bg-paper-warm px-5 py-5 text-[0.85rem] leading-[1.95] text-ink/80">
              <p className="font-mincho text-[0.98rem] text-forest">
                直売・見学について
              </p>
              <p className="mt-3">{siteConfig.farmVisit.note}</p>
              <p className="mt-2 text-moss">
                駐車場の有無については{UNCONFIRMED_NOTE}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
              >
                電話をかける
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
              >
                お問い合わせ
              </Link>
            </div>
          </Reveal>

          {/* ---- 地図 ---- */}
          <Reveal delay={0.1}>
            <div className="h-[24rem] overflow-hidden border border-ink/12 md:h-[30rem]">
              <iframe
                src={siteConfig.mapEmbedUrl}
                title={`${siteConfig.name}の所在地（${siteConfig.address.full}）の地図`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <p className="mt-4 text-[0.82rem] leading-[1.9] text-moss">
              指宿市山川は薩摩半島の最南端にあたる地域です。
              鹿児島市内から南へ、指宿市の中心部をさらに越えた先にあります。
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 土地のこと ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <Photo
                src="/images/farm/lychee-trees.jpg"
                alt="ハウスで育つ山川園芸のライチの木"
                aspect="aspect-[4/3]"
                sizes="(min-width: 768px) 48vw, 100vw"
                tone="leaf"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-mincho text-[1.4rem] leading-[1.6] text-forest md:text-[1.7rem]">
                指宿という土地のこと
              </h2>
              <span
                aria-hidden="true"
                className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
              />
              <div className="mt-7 space-y-5 text-[0.94rem] leading-[2.05] text-ink/85">
                <p>
                  指宿市は鹿児島県の薩摩半島南部にある市です。
                  そのなかでも山川は、半島のいちばん南にあたります。
                </p>
                <p>
                  三方を海に囲まれ、冬の冷え込みがゆるやかなこの土地は、
                  熱帯の果樹を育てられる数少ない場所のひとつです。
                </p>
              </div>
              <p className="mt-7">
                <Link
                  href="/column/ibusuki-tropical-fruit"
                  className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                >
                  指宿で南国のフルーツが育つ理由を読む
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
