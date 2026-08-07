import Link from "next/link";
import JsonLd from "@/components/ui/JsonLd";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { faqJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { getProduct } from "@/data/products";

/**
 * ライチの食べ方・保存方法（/how-to-eat）
 *
 * 検索意図：「ライチ 食べ方」「ライチ 皮 むき方」「ライチ 保存方法」
 * ※「ライチとは」「生と冷凍の違い」は /lychee が担当する。
 *
 * 保存方法は公式オンラインショップの商品ページ記載にもとづく。
 * 商品データ（data/products.ts）の storage と同じ内容を参照しているので、
 * 商品側を更新すればこのページの記載も一致する。
 */

export const metadata = buildMetadata({
  title: "ライチの食べ方・保存方法｜皮のむき方から冷凍まで",
  description:
    "ライチの皮のむき方、食べるときのコツ、届いたあとの保存方法を写真つきでご案内します。冷蔵で約1週間、冷凍での保存の仕方も。",
  path: "/how-to-eat",
  keywords: [
    "ライチ 食べ方",
    "ライチ 皮 むき方",
    "ライチ 保存方法",
    "ライチ 冷凍",
  ],
});

const PAGE_FAQ = [
  {
    question: "ライチの皮はどうやってむきますか？",
    answer:
      "包丁は必要ありません。ヘタのついていた側から爪を入れると皮に切れ目が入るので、あとはみかんのように指でむいてください。中に大きめの種がひとつありますので、種を避けながらお召し上がりください。",
  },
  {
    question: "届いたライチはどう保存しますか？",
    answer:
      "冷蔵庫で保存し、約1週間を目安にお召し上がりください。乾燥すると果皮の色が変わりやすいため、ジッパー付きの袋などに入れて保存してください。",
  },
  {
    question: "ライチは冷凍できますか？",
    answer:
      "皮つきのまま冷凍保存できます。凍らせたものは半解凍でシャーベットのように食べられるほか、スムージーやデザートの材料としても使えます。",
  },
];

const STEPS = [
  {
    index: "01",
    title: "冷蔵庫でよく冷やす",
    body: "食べる前に冷蔵庫で冷やしておきます。冷たいほうが、みずみずしさを感じやすくなります。",
  },
  {
    index: "02",
    title: "ヘタのあった側から爪を入れる",
    body: "枝についていたほうの端に爪を立てると、皮に切れ目が入ります。包丁は要りません。",
  },
  {
    index: "03",
    title: "みかんのようにむく",
    body: "切れ目から指で皮をむいていきます。果汁が出るので、お皿の上でむくと安心です。",
  },
  {
    index: "04",
    title: "種を避けて食べる",
    body: "中心に大きめの種がひとつあります。種のまわりの果肉をいただきます。",
  },
];

export default function HowToEatPage() {
  const lychee = getProduct("nama-lychee-500g");

  return (
    <>
      <JsonLd data={faqJsonLd(PAGE_FAQ)} />

      <PageHero
        eyebrow="How to eat"
        title={
          <>
            ライチの食べ方と、
            <br className="sm:hidden" />
            届いたあとのこと
          </>
        }
        lead="皮のむき方から保存の仕方まで。むずかしいことはひとつもありません。"
        crumbs={[{ name: "食べ方・保存方法", path: "/how-to-eat" }]}
      />

      {/* ---- 皮のむき方 ----
          [TODO] 手順ごとの写真（爪を入れる／むく／果肉）が撮れたら
          public/images/guide/ に置き、各ステップの横に添えると
          ぐっと分かりやすくなります。今は文章だけで完結する組みにしています。 */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <h2 className="font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.9rem]">
              皮のむき方は、
              <br className="hidden md:block" />
              4つだけ
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <div className="mt-9 hidden md:block">
              <Photo
                src="/images/lychee/lychee-in-hand.jpg"
                alt="手に持ったライチ一粒"
                aspect="aspect-[4/5]"
                sizes="35vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="border-t border-ink/12">
              {STEPS.map((step) => (
                <li key={step.index} className="flex gap-6 border-b border-ink/12 py-7">
                  <span className="font-serif-en text-[0.78rem] tracking-[0.26em] text-lychee-deep">
                    {step.index}
                  </span>
                  <div>
                    <h3 className="font-mincho text-[1.15rem] leading-[1.7] text-forest md:text-[1.3rem]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[32rem] text-[0.93rem] leading-[2.05] text-ink/80">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-14 border border-ink/12 bg-paper-warm px-6 py-6">
          <p className="text-[0.88rem] leading-[1.95] text-ink/80">
            種があります。小さなお子様やご高齢の方がお召し上がりの際は、
            誤って飲み込まないようご注意ください。
          </p>
        </Reveal>
      </section>

      {/* ---- 保存方法 ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Storage
            </p>
            <h2 className="mt-5 font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.9rem]">
              届いたら、どうすればいい？
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <Reveal>
              <h3 className="font-mincho text-[1.15rem] text-forest">
                冷蔵で保存する
              </h3>
              <div className="mt-5 space-y-4 text-[0.93rem] leading-[2.05] text-ink/85">
                <p>
                  {lychee?.storage ??
                    "冷蔵庫で約1週間を目安にお召し上がりください。"}
                </p>
                <p>
                  届いたらまず箱から出し、冷蔵庫へ入れてください。
                  生鮮食品ですので、お早めにお召し上がりいただくのがいちばんです。
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h3 className="font-mincho text-[1.15rem] text-forest">
                冷凍で保存する
              </h3>
              <div className="mt-5 space-y-4 text-[0.93rem] leading-[2.05] text-ink/85">
                <p>
                  食べきれない分は、皮つきのまま冷凍しておくことができます。
                </p>
                <p>
                  半解凍でシャーベットのように食べたり、
                  皮と種を取ってスムージーやデザートの材料にしたりと、
                  凍らせてからの楽しみ方もあります。
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            {/* 実際に袋へ入れて保存している写真。本文の説明とそのまま対応する */}
            <Photo
              src="/images/guide/lychee-packing.jpg"
              alt="ジッパー付きの袋に入れた生ライチと発泡スチロールの箱"
              aspect="aspect-[4/3] md:aspect-[16/9]"
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- Q&A ---- */}
      <section className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.75rem]">
            食べ方・保存についての質問
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
        </Reveal>
        <Reveal className="mt-10">
          <dl className="border-t border-ink/12">
            {PAGE_FAQ.map((item) => (
              <div key={item.question} className="border-b border-ink/12 py-7">
                <dt className="font-mincho text-[1.05rem] leading-[1.7] text-forest">
                  {item.question}
                </dt>
                <dd className="mt-3 text-[0.92rem] leading-[2] text-ink/80">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-lychee bg-lychee px-8 py-3.5 text-[0.9rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
          >
            生ライチを見る
          </Link>
          <Link
            href="/lychee"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
          >
            ライチについて
          </Link>
        </Reveal>
      </section>
    </>
  );
}
