import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { alsoGrowing, fruitDisplayName, fruitPath, fruits } from "@/data/fruits";

/**
 * ライチのほかに育てている果物（TOPページ）
 *
 * 農園のストーリーのあとに置く。
 * 「ライチだけの農園ではない」ことが、ここで初めて写真とともに伝わる。
 *
 * 内容は data/fruits.ts から引いているので、
 * 果物を足せばここにも自動で並ぶ。
 *
 * 同じ大きさのカードを等間隔に並べると通販サイトの見た目になるため、
 * 写真の縦位置をずらして雑誌のような組みにしている。
 */
export default function OtherFruitsSection() {
  if (fruits.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="max-w-2xl">
        <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
          Our fruits
        </p>
        <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
          ライチのほかにも、
          <br className="hidden sm:block" />
          育てています。
        </h2>
        <span
          aria-hidden="true"
          className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
        />
        <p className="mt-7 text-[0.93rem] leading-[2.05] text-moss">
          冬の冷え込みがゆるやかな指宿市山川では、南国の果樹が育ちます。
          ハウスの中には、ライチのほかにもいくつもの果物が実ります。
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8">
        {fruits.map((fruit, index) => (
          <Reveal
            key={fruit.slug}
            delay={index * 0.07}
            /* 真ん中だけ下にずらして、平らな並びにしない */
            className={index === 1 ? "md:mt-16" : undefined}
          >
            <Link href={fruitPath(fruit.slug)} className="group block">
              <Photo
                src={fruit.hero.src}
                alt={fruit.hero.alt}
                aspect="aspect-[4/5]"
                sizes="(min-width: 1152px) 350px, (min-width: 768px) 30vw, 45vw"
                tone="leaf"
              />
              <p className="mt-5 font-serif-en text-[0.64rem] uppercase tracking-[0.24em] text-leaf">
                {fruit.nameEn}
              </p>
              <p className="mt-2 font-mincho text-[1.15rem] leading-snug text-forest underline-offset-4 group-hover:underline md:text-[1.3rem]">
                {fruitDisplayName(fruit)}
              </p>
              <p className="mt-2 text-[0.84rem] leading-[1.85] text-moss">
                {fruit.lead}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      {alsoGrowing.length > 0 ? (
        <Reveal className="mt-14" delay={0.1}>
          <p className="text-[0.88rem] leading-[1.95] text-moss">
            このほかに、{alsoGrowing.map((item) => item.name).join("・")}
            も育てています。
          </p>
        </Reveal>
      ) : null}

      <Reveal className="mt-10" delay={0.12}>
        <Link
          href="/fruits"
          className="inline-flex items-center justify-center border border-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-forest transition-colors duration-300 hover:bg-forest hover:text-paper"
        >
          育てている果物を見る
        </Link>
      </Reveal>
    </section>
  );
}
