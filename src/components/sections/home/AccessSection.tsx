import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/siteConfig";

/**
 * アクセス・農園情報
 *
 * 地域名（鹿児島県・指宿市・山川）を本文と見出しに自然に含める。
 * 地図はページ表示をブロックしないよう loading="lazy" で読み込む。
 */
export default function AccessSection() {
  return (
    <section className="grain bg-forest text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-soft">
              Access
            </p>
            <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-cream md:text-[2.05rem]">
              鹿児島県指宿市山川
              <br />
              農園のこと
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-8 block h-px w-16 bg-cream/40"
            />

            <dl className="mt-10 divide-y divide-cream/12 border-y border-cream/12 text-[0.88rem]">
              <div className="flex gap-6 py-5">
                <dt className="w-20 shrink-0 text-cream/55">屋号</dt>
                <dd>{siteConfig.name}</dd>
              </div>
              <div className="flex gap-6 py-5">
                <dt className="w-20 shrink-0 text-cream/55">代表</dt>
                <dd>{siteConfig.owner}</dd>
              </div>
              <div className="flex gap-6 py-5">
                <dt className="w-20 shrink-0 text-cream/55">所在地</dt>
                <dd>
                  <a
                    href={siteConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-lychee-soft"
                  >
                    {siteConfig.address.full}
                  </a>
                </dd>
              </div>
              <div className="flex gap-6 py-5">
                <dt className="w-20 shrink-0 text-cream/55">電話</dt>
                <dd>
                  <a
                    href={siteConfig.phoneHref}
                    className="underline underline-offset-4 hover:text-lychee-soft"
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-6 py-5">
                <dt className="w-20 shrink-0 text-cream/55">受付時間</dt>
                <dd>
                  {siteConfig.hoursSummary}
                  <span className="mt-1 block text-cream/60">
                    {siteConfig.busySeasonNote}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-9">
              <Link
                href="/access"
                className="inline-flex items-center justify-center border border-cream/40 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-cream transition-colors duration-300 hover:bg-cream hover:text-forest-deep"
              >
                農園情報・アクセス
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-[22rem] overflow-hidden border border-cream/15 md:h-full md:min-h-[26rem]">
              <iframe
                src={siteConfig.mapEmbedUrl}
                title={`${siteConfig.name}の所在地（${siteConfig.address.full}）の地図`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
