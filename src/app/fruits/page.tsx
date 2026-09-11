import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { fruitDisplayName, fruitPath, fruits } from "@/data/fruits";
import { buildMetadata } from "@/lib/metadata";

/**
 * 育てている果物（/fruits）
 *
 * ライチ以外に山川園芸で育てている果物の入口。
 * 果物を増やすときは src/data/fruits.ts に1件足すだけでよい。
 *
 * 同じ大きさのカードを並べるグリッドにはせず、
 * 写真と文章が左右交互に現れる、雑誌のような組みにしている。
 */

export const metadata = buildMetadata({
  title: "育てている果物｜ドラゴンフルーツ・龍眼・ホワイトサポテ",
  description:
    "鹿児島県指宿市山川の山川園芸では、ライチのほかにドラゴンフルーツ・龍眼（リュウガン）・ホワイトサポテを育てています。それぞれの特徴と、農園で撮った実の様子をご紹介します。",
  path: "/fruits",
  keywords: [
    "指宿 南国フルーツ",
    "鹿児島 熱帯果樹",
    "ドラゴンフルーツ 鹿児島",
    "龍眼 国産",
    "ホワイトサポテ",
  ],
});

export default function FruitsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our fruits"
        title={
          <>
            ライチのほかに、
            <br className="hidden sm:block" />
            育てている果物。
          </>
        }
        lead="指宿市山川の農園では、ライチのほかにも南国の果物を育てています。"
        crumbs={[{ name: "育てている果物", path: "/fruits" }]}
      />

      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="space-y-20 md:space-y-28">
          {fruits.map((fruit, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={fruit.slug}
                className="grid gap-9 md:grid-cols-2 md:items-center md:gap-16"
              >
                <Reveal className={reverse ? "md:order-2" : undefined}>
                  <Link href={fruitPath(fruit.slug)} className="block">
                    <Photo
                      src={fruit.hero.src}
                      alt={fruit.hero.alt}
                      aspect="aspect-[4/5]"
                      sizes="(min-width: 1152px) 540px, (min-width: 768px) 46vw, 100vw"
                      priority={index === 0}
                      tone="leaf"
                    />
                  </Link>
                </Reveal>

                <Reveal delay={0.08} className={reverse ? "md:order-1" : undefined}>
                  <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.28em] text-leaf">
                    {String(index + 1).padStart(2, "0")} — {fruit.nameEn}
                  </p>
                  <h2 className="mt-4 font-mincho text-[1.6rem] leading-[1.5] text-forest md:text-[2rem]">
                    {fruitDisplayName(fruit)}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
                  />
                  <p className="mt-7 text-[0.95rem] leading-[2.05] text-ink/85">
                    {fruit.answer.body}
                  </p>
                  <p className="mt-8">
                    <Link
                      href={fruitPath(fruit.slug)}
                      className="text-[0.92rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                    >
                      {fruit.name}の特徴と食べ方を見る
                    </Link>
                  </p>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---- ライチへ ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <div className="grid gap-9 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
            <Reveal>
              <Photo
                src="/images/lychee/lychee-on-tree.jpg"
                alt="木になっているライチの実"
                aspect="aspect-[4/3]"
                sizes="(min-width: 768px) 44vw, 100vw"
                tone="leaf"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.28em] text-leaf">
                Lychee
              </p>
              <h2 className="mt-4 font-mincho text-[1.4rem] leading-[1.6] text-forest md:text-[1.7rem]">
                山川園芸の中心は、ライチです。
              </h2>
              <p className="mt-6 text-[0.94rem] leading-[2.05] text-ink/85">
                龍眼はライチの仲間です。ライチの選び方・食べ方・保存方法は、
                ライチ完全ガイドにまとめています。
              </p>
              <p className="mt-8">
                <Link
                  href="/lychee"
                  className="text-[0.92rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                >
                  ライチ完全ガイドを読む
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
