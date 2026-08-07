import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { storyChapters } from "@/data/story";
import { siteConfig } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";

/**
 * 山川園芸について（/about）
 *
 * 会社概要ではなく、写真と文章が交互に現れるストーリー形式。
 * 本文は data/story.ts が持っている。文章が未確認の章（body が null）は
 * 表示されないので、このページに作り話が出ることはない。
 * ヒアリング後に data/story.ts へ文章を入れれば、そのまま章が増える。
 */

export const metadata = buildMetadata({
  title: "山川園芸について｜鹿児島県指宿市山川のライチ農園",
  description:
    "鹿児島県指宿市山川でライチをはじめとする熱帯果樹を育てている山川園芸。薩摩半島の最南端という土地のこと、農園から直接お届けしていることをご紹介します。",
  path: "/about",
  keywords: ["山川園芸", "指宿 ライチ農園", "鹿児島 ライチ 農家", "指宿 フルーツ"],
});

export default function AboutPage() {
  const published = storyChapters.filter((chapter) => chapter.body !== null);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            薩摩半島のいちばん南で、
            <br className="hidden sm:block" />
            熱帯の果樹を育てています。
          </>
        }
        lead={`${siteConfig.name}／代表 ${siteConfig.owner}　${siteConfig.address.full}`}
        crumbs={[{ name: "山川園芸について", path: "/about" }]}
      />

      {/* ---- ストーリー ---- */}
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="space-y-24 md:space-y-32">
          {published.map((chapter, index) => (
            <Reveal
              key={chapter.id}
              as="section"
              className="grid gap-9 md:grid-cols-2 md:items-center md:gap-16"
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <Photo
                  src={chapter.photo.src}
                  alt={chapter.photo.alt}
                  slot={chapter.photo.slot}
                  label={chapter.photo.label}
                  aspect={index % 2 === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}
                  sizes="(min-width: 768px) 48vw, 100vw"
                  tone={index % 2 === 0 ? "leaf" : "cream"}
                />
              </div>

              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <p className="font-serif-en text-[0.72rem] tracking-[0.3em] text-lychee-deep">
                  {chapter.index}
                </p>
                <h2 className="mt-4 font-mincho text-[1.4rem] leading-[1.6] text-forest md:text-[1.8rem]">
                  {chapter.title}
                </h2>
                <span
                  aria-hidden="true"
                  className="reveal-line mt-7 block h-px w-14 bg-leaf/60"
                />
                <div className="mt-7 space-y-5 text-[0.95rem] leading-[2.1] text-ink/85">
                  {chapter.body?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---- 農園の概要 ---- */}
      <section className="grain bg-forest-deep text-cream">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-cream md:text-[1.75rem]">
              農園について
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-cream/40"
            />
          </Reveal>

          <Reveal className="mt-10">
            <dl className="divide-y divide-cream/12 border-y border-cream/12 text-[0.9rem]">
              {[
                { term: "屋号", desc: siteConfig.name },
                { term: "代表者", desc: siteConfig.owner },
                { term: "所在地", desc: siteConfig.address.full },
                { term: "電話", desc: siteConfig.phone },
                {
                  term: "受付時間",
                  desc: `${siteConfig.hoursSummary}（${siteConfig.busySeasonNote}）`,
                },
                {
                  term: "栽培",
                  desc: "ライチをはじめとする熱帯性の果樹。苗木の取り扱いもあります。",
                },
                {
                  term: "販売",
                  desc: "オンラインでの産地直送のほか、南さつま市のPICO様の青果コーナーにてお取り扱いいただいています。",
                },
              ].map((item) => (
                <div
                  key={item.term}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8"
                >
                  <dt className="w-28 shrink-0 text-cream/55">{item.term}</dt>
                  <dd className="leading-[1.95] text-cream/85">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/access"
              className="inline-flex items-center justify-center border border-cream/40 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-cream transition-colors duration-300 hover:bg-cream hover:text-forest-deep"
            >
              農園情報・アクセス
            </Link>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-cream/40 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-cream transition-colors duration-300 hover:bg-cream hover:text-forest-deep"
            >
              農園の日々を見る
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---- 商品への導線 ---- */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-24">
        <Reveal className="text-center">
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.75rem]">
            この農園で育ったライチを
          </h2>
          <p className="mx-auto mt-6 max-w-[34rem] text-[0.93rem] leading-[2.05] text-moss">
            収穫できるのは旬のあいだだけ。穫れた実を、農園から直接お届けします。
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex items-center justify-center border border-lychee bg-lychee px-9 py-4 text-[0.92rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
          >
            オンラインショップ
          </Link>
        </Reveal>
      </section>
    </>
  );
}
