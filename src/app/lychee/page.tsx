import Link from "next/link";
import JsonLd from "@/components/ui/JsonLd";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { faqJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { salesStatus } from "@/data/siteConfig";
import { lycheeVarieties, varietyNote } from "@/data/products";

/**
 * ライチについて（/lychee）
 *
 * 検索意図：「ライチとは」「生ライチ」「国産ライチ」
 * ※ 食べ方・保存方法は /how-to-eat が担当する。ここでは深追いしない
 *   （同じ検索意図のページを2つ作らないため）。
 *
 * 内容はライチという果物についての一般的な情報。
 * 山川園芸の品種・糖度・栽培方法など未確認のことは書かない。
 */

export const metadata = buildMetadata({
  title: "生ライチとは｜国産ライチの旬・冷凍との違い",
  description:
    "生ライチとはどんな果物か、冷凍ライチとの違い、国産ライチの旬の時期をやさしく解説します。ライチを食べたことがない方に向けた入門ページです。",
  path: "/lychee",
  keywords: [
    "生ライチ",
    "国産ライチ",
    "ライチとは",
    "ライチ 旬",
    "生ライチ 冷凍 違い",
    "ライチ 品種",
    "桂味 ライチ",
    "ノーマイチー",
    "三月紅",
  ],
});

/** このページに表示するQ&A（画面と構造化データを同じ配列から作る） */
const PAGE_FAQ = [
  {
    question: "生ライチと冷凍ライチは何が違いますか？",
    answer:
      "生ライチは、木で色づいた実をそのままお届けするものです。冷凍ライチは収穫後に凍らせたもので、日本ではこちらが広く流通しています。生は皮をむいたときの香りと、果汁のみずみずしさが持ち味です。",
  },
  {
    question: "国産のライチはなぜ珍しいのですか？",
    answer:
      "ライチは熱帯・亜熱帯の果物のため、日本で育てられる地域が限られています。加えて収穫できる期間がごく短く、収穫後の日もちも長くありません。そのため国産の生ライチは市場に出る量が少なくなっています。",
  },
  {
    question: "ライチの旬はいつですか？",
    answer:
      "国内で育つライチは、産地によって6月下旬から8月ごろに収穫期を迎えます。山川園芸からお届けできるのは、7月上旬からお盆ごろまでです。その年の天候によって前後します。",
  },
  {
    question: "ライチにはどんな品種がありますか？",
    answer:
      "山川園芸では、7月ごろは三月紅と在来種（佐多、黒葉）、8月ごろは宮崎ライチと呼ばれる種、桂味、ノーマイチーを収穫しています。熟す順に穫っていくため、お届けする品種は時期によって変わります。品種を指定してのご購入はお受けしておりません。",
  },
];

export default function LycheePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(PAGE_FAQ)} />

      <PageHero
        eyebrow="About lychee"
        title={
          <>
            生のライチって、
            <br className="sm:hidden" />
            どんな果物？
          </>
        }
        lead="ライチを食べたことがない方、冷凍のものしか知らない方に向けて。むずかしい言葉を使わずにご説明します。"
        crumbs={[{ name: "ライチについて", path: "/lychee" }]}
      />

      {/* ---- ライチとは ---- */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.9rem]">
            ライチとは、南の国で育つ果物です
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
        </Reveal>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-14">
          <Reveal>
            <div className="space-y-6 text-[0.96rem] leading-[2.1] text-ink/85">
              <p>
                ライチは、暖かい地域で育つ果物です。漢字では「茘枝」と書きます。
                外側の皮は赤く、少しごつごつしていて、なかの実は白くてやわらかく、
                たっぷりの果汁を含んでいます。
              </p>
              <p>
                中心には大きめの種がひとつ。皮をむいて、種を避けながら食べます。
                包丁もお皿も要りません。
              </p>
              <p>
                日本では、鹿児島・宮崎・沖縄など南の地域で育てられています。
                とはいえ育てられる場所は限られていて、
                国産のライチは市場に出る量がとても少ない果物です。
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            {/* [TODO] 皮をむいた果肉・種が分かる写真が撮れたら
                public/images/lychee/lychee-cut.jpg に置いて差し替える。 */}
            <Photo
              src="/images/lychee/lychee-closeup.jpg"
              alt="生ライチの果皮のアップ"
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- 生と冷凍の違い ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Fresh or frozen
            </p>
            <h2 className="mt-5 font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.9rem]">
              冷凍ライチしか
              <br className="sm:hidden" />
              食べたことがない方へ
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <p className="mt-8 max-w-[40rem] text-[0.95rem] leading-[2.1] text-ink/85">
              スーパーや飲食店でよく見かけるライチの多くは、収穫後に凍らせたものです。
              生のライチは、そもそも状態が違います。
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
                <caption className="sr-only">
                  生ライチと冷凍ライチの違い
                </caption>
                <thead>
                  <tr className="border-y border-ink/15">
                    <th scope="col" className="w-28 py-4 pr-4 font-normal text-moss">
                      <span className="sr-only">比べる項目</span>
                    </th>
                    <th
                      scope="col"
                      className="py-4 pr-6 font-mincho text-[1rem] text-lychee-deep"
                    >
                      生ライチ
                    </th>
                    <th
                      scope="col"
                      className="py-4 font-mincho text-[1rem] text-forest"
                    >
                      冷凍ライチ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/12">
                  {[
                    {
                      label: "状態",
                      fresh: "収穫したままの実",
                      frozen: "収穫後に凍らせた実",
                    },
                    {
                      label: "香り",
                      fresh: "皮をむくと立ちのぼる",
                      frozen: "解凍しても穏やか",
                    },
                    {
                      label: "食感",
                      fresh: "みずみずしく、果汁が多い",
                      frozen: "解凍具合によって変わる",
                    },
                    {
                      label: "出回る時期",
                      fresh: "夏のごく短い期間だけ",
                      frozen: "一年をとおして",
                    },
                    {
                      label: "日もち",
                      fresh: "冷蔵で約1週間",
                      frozen: "冷凍のまま長期間",
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="py-4 pr-4 align-top font-normal text-moss"
                      >
                        {row.label}
                      </th>
                      <td className="py-4 pr-6 align-top leading-[1.9]">
                        {row.fresh}
                      </td>
                      <td className="py-4 align-top leading-[1.9] text-ink/75">
                        {row.frozen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-[0.82rem] leading-[1.9] text-moss">
              ※ 冷凍ライチが劣るという意味ではありません。
              凍らせたまま食べるおいしさもあります。生と冷凍は別の食べものだとお考えください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 旬 ---- */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <Photo
              src="/images/lychee/lychee-on-tree.jpg"
              alt="木で色づいたライチの実"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 48vw, 100vw"
              tone="leaf"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.85rem]">
              旬は、初夏のほんの数週間
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
            />
            <div className="mt-8 space-y-5 text-[0.95rem] leading-[2.1] text-ink/85">
              <p>
                山川園芸のライチをお届けできるのは、{salesStatus.seasonLabel}
                まで。その年の気温や雨の降り方によって、時期は前後します。
              </p>
              <p>
                収穫できる期間が短く、穫ったあとの日もちも長くありません。
                だからこそ、産地から直接お届けする形が向いている果物です。
              </p>
            </div>
            <p className="mt-8">
              <Link
                href="/column/lychee-season"
                className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                ライチの旬について、くわしく読む
              </Link>
            </p>
          </Reveal>
        </div>

        {/* ---- 品種 ----
            収穫の時期で品種が変わる。data/products.ts の lycheeVarieties から
            生成しているので、品種を足すときはそちらを1行足すだけでよい。 */}
        <Reveal className="mt-20 border-t border-ink/12 pt-14 md:mt-28">
          <h2 className="font-mincho text-[1.5rem] leading-[1.6] text-forest md:text-[1.85rem]">
            時期によって、品種が変わります
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
          <p className="mt-8 max-w-[40rem] text-[0.95rem] leading-[2.1] text-ink/85">
            山川園芸では、収穫の時期に合わせて何種類かのライチを育てています。
            熟す順に穫っていくため、お届けする品種は時期によって変わります。
          </p>

          <dl className="mt-10 divide-y divide-ink/12 border-y border-ink/12">
            {lycheeVarieties.map((group) => (
              <div
                key={group.period}
                className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-10"
              >
                <dt className="w-28 shrink-0 font-mincho text-[1.02rem] text-lychee-deep">
                  {group.period}
                </dt>
                <dd className="text-[0.95rem] leading-[1.95]">
                  {group.names.join("／")}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 border border-ink/12 bg-paper-warm px-5 py-4 text-[0.86rem] leading-[1.95] text-moss">
            {varietyNote}
          </p>
        </Reveal>
      </section>

      {/* ---- Q&A ---- */}
      <section className="bg-paper-warm">
        <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.75rem]">
              ライチについて、よくいただく質問
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
        </div>
      </section>

      {/* ---- 次に読む ---- */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <h2 className="font-mincho text-[1.3rem] text-forest">次に読む</h2>
          <ul className="mt-8 divide-y divide-ink/12 border-y border-ink/12">
            {[
              {
                href: "/how-to-eat",
                title: "ライチの食べ方・保存方法",
                desc: "皮のむき方から、届いたあとの保存の仕方まで。",
              },
              {
                href: "/shop",
                title: "オンラインショップ",
                desc: "指宿・山川の農園から、旬の生ライチを産地直送で。",
              },
              {
                href: "/column",
                title: "コラム",
                desc: "旬のこと、贈り物のこと、指宿の気候のこと。",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-6 py-6"
                >
                  <span>
                    <span className="font-mincho text-[1.05rem] text-forest underline-offset-8 group-hover:underline">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-[0.87rem] text-moss">
                      {item.desc}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lychee-deep"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
