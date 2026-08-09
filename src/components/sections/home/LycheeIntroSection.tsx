import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { salesStatus } from "@/data/siteConfig";

/**
 * 「生のライチ、食べたことありますか？」
 *
 * ライチを知らない人に、いちばん最初に読んでもらう導入。
 * 糖度・サイズ・品質など、確認できていないことは書かない。
 * 書いているのは「冷凍と生では状態が違う」という事実だけ。
 */
export default function LycheeIntroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="max-w-[46rem]">
        <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
          For the first time
        </p>
        <h2 className="mt-5 font-mincho text-[1.75rem] leading-[1.55] text-forest md:text-[2.4rem]">
          生のライチ、
          <br className="sm:hidden" />
          食べたことがありますか。
        </h2>
        <span
          aria-hidden="true"
          className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
        />
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
        <Reveal className="order-2 md:order-1">
          <div className="space-y-6 text-[0.96rem] leading-[2.1] text-ink/85">
            <p>
              スーパーの冷凍コーナーで見かける、あのライチ。
              日本で食べられているライチの多くは、凍らせた状態のものです。
            </p>
            <p>
              生のライチは、そもそも別の食べものだと思っていただいてかまいません。
              皮をむいた瞬間に香りが立ちのぼり、ひと口噛むと果汁があふれます。
            </p>
            <p>
              国内で穫れる生のライチは、旬がとても短い果物です。
              山川園芸からお届けできるのは
              {salesStatus.seasonLabel}まで。
              その年の実りに合わせて、ほんの数週間だけのお取り扱いです。
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/lychee"
              className="text-[0.9rem] text-lychee-deep underline underline-offset-8 transition-colors hover:text-lychee"
            >
              生ライチと冷凍ライチの違いを見る
            </Link>
            <Link
              href="/how-to-eat"
              className="text-[0.9rem] text-lychee-deep underline underline-offset-8 transition-colors hover:text-lychee"
            >
              食べ方・保存方法を見る
            </Link>
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2">
          <Photo
            src="/images/lychee/lychee-closeup.jpg"
            alt="生ライチの果皮のアップ"
            aspect="aspect-[4/5]"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
