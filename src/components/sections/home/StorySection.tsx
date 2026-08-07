import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { publishedChapters } from "@/data/story";
import { siteConfig } from "@/data/siteConfig";

/**
 * 山川園芸について（TOPの導入）
 *
 * 本文は data/story.ts から取る。未確認の章は最初から表示されないので、
 * ここに作り話が出ることはない。文章が追加されれば自動的に反映される。
 */
export default function StorySection() {
  const chapter = publishedChapters[0];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-16">
        <Reveal>
          {/* [TODO] 生産者（泊 久美子さん）のポートレートが届いたら、
              ここを public/images/about/producer.jpg に差し替える。
              「誰から買うのか」が伝わるので、CVにいちばん効く1枚。 */}
          <Photo
            src="/images/farm/lychee-trees.jpg"
            alt="ハウスで育つ山川園芸のライチの木"
            aspect="aspect-[4/5]"
            sizes="(min-width: 768px) 42vw, 100vw"
            tone="leaf"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
            About
          </p>
          <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
            誰が、どこで
            <br />
            育てているのか。
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
          />

          {chapter && (
            <div className="mt-8 space-y-6 text-[0.95rem] leading-[2.1] text-ink/85">
              {chapter.body.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}

          <dl className="mt-10 divide-y divide-ink/12 border-y border-ink/12 text-[0.88rem]">
            <div className="flex gap-6 py-4">
              <dt className="w-20 shrink-0 text-moss">屋号</dt>
              <dd>{siteConfig.name}</dd>
            </div>
            <div className="flex gap-6 py-4">
              <dt className="w-20 shrink-0 text-moss">代表</dt>
              <dd>{siteConfig.owner}</dd>
            </div>
            <div className="flex gap-6 py-4">
              <dt className="w-20 shrink-0 text-moss">所在地</dt>
              <dd>{siteConfig.address.full}</dd>
            </div>
          </dl>

          <div className="mt-9">
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
            >
              山川園芸について
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
