import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/siteConfig";

/**
 * 農園の日々
 *
 * Instagramへ自然につなぐ写真主体の面。
 * 投稿の埋め込みスクリプトは表示速度を大きく落とすため使わず、
 * 農園の写真を並べてアカウントへ誘導する。
 *
 * 写真が増えたら TILES に足すだけで並びが増える。
 * 枚数が少ないうちは、無理にタイルを埋めず大きく2枚見せる。
 */

const TILES = [
  {
    src: "/images/lychee/lychee-on-tree.jpg",
    alt: "木になっているライチの実",
  },
  {
    src: "/images/guide/lychee-packing.jpg",
    alt: "袋と箱に詰めた収穫後のライチ",
  },
];

export default function InstagramSection() {
  return (
    <section className="bg-paper-warm">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-28">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Instagram
            </p>
            <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.05rem]">
              農園の日々
            </h2>
            <p className="mt-6 max-w-[34rem] text-[0.92rem] leading-[2.05] text-moss">
              花が咲いてから実が色づくまで。収穫の日の様子や、
              その年の実りのことは、公式Instagramでお伝えしています。
            </p>
          </div>

          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-ink/20 px-7 py-3.5 text-[0.88rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
          >
            {siteConfig.instagram.handle} をフォロー
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-5">
          {TILES.map((tile, index) => (
            <Reveal key={tile.src} delay={index * 0.06}>
              <Photo
                src={tile.src}
                alt={tile.alt}
                aspect="aspect-[3/4]"
                sizes="(min-width: 768px) 45vw, 50vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
