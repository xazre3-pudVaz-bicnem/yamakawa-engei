import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * 初めてライチを食べる方へ
 *
 * 専門用語を使わず、短い文で書く。
 * 詳しい説明は /lychee と /how-to-eat に分け、ここでは要点だけを見せる。
 */

const QUESTIONS: Array<{ q: string; a: string; href: string }> = [
  {
    q: "ライチって、どんな果物？",
    a: "南の国で育つ果物です。皮は赤く、なかの実は白くてやわらかく、たっぷりの果汁を含んでいます。",
    href: "/lychee",
  },
  {
    q: "どうやって食べるの？",
    a: "包丁は要りません。ヘタのあった側から爪を入れると皮に切れ目が入るので、あとは指でむくだけです。",
    href: "/lychee/how-to-eat",
  },
  {
    q: "どんな味がするの？",
    a: "甘みと、少しの酸味。何より香りが特徴です。生のライチは、皮をむいたときの香りが冷凍のものとは違います。",
    href: "/lychee",
  },
  {
    q: "届いたら、どうすればいい？",
    a: "箱から出して冷蔵庫へ。乾燥を防ぐため、ジッパー付きの袋などに入れて保存してください。",
    href: "/lychee/how-to-eat",
  },
  {
    q: "どれくらい日もちする？",
    a: "冷蔵庫で約1週間が目安です。食べきれない分は、皮つきのまま冷凍しておくこともできます。",
    href: "/lychee/how-to-eat",
  },
  {
    q: "冷やしたほうがおいしい？",
    a: "しっかり冷やしてからのほうが、みずみずしさを感じやすくなります。",
    href: "/lychee/how-to-eat",
  },
];

export default function FirstTimeSection() {
  return (
    <section className="bg-paper-warm">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Beginner&apos;s guide
            </p>
            <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
              初めてライチを
              <br />
              食べる方へ
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
            />
            <p className="mt-7 max-w-[24rem] text-[0.92rem] leading-[2.05] text-moss">
              むずかしいことはありません。
              知っておくと、もっとおいしく食べられることだけをまとめました。
            </p>

            <div className="mt-9 hidden md:block">
              <Photo
                src="/images/lychee/lychee-in-hand.jpg"
                alt="手に持ったライチ一粒"
                aspect="aspect-[4/5]"
                sizes="30vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="border-t border-ink/12">
              {QUESTIONS.map((item) => (
                <div key={item.q} className="border-b border-ink/12 py-7">
                  <dt className="font-mincho text-[1.05rem] leading-[1.7] text-forest">
                    {item.q}
                  </dt>
                  <dd className="mt-3 text-[0.92rem] leading-[2] text-ink/80">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/lychee"
                className="inline-flex items-center justify-center border border-forest bg-forest px-7 py-3.5 text-[0.88rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
              >
                ライチについて
              </Link>
              <Link
                href="/lychee/how-to-eat"
                className="inline-flex items-center justify-center border border-ink/20 px-7 py-3.5 text-[0.88rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
              >
                食べ方・保存方法
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
