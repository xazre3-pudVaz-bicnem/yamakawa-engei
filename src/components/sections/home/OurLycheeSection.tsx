import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/siteConfig";

/**
 * 山川園芸のライチ
 *
 * 写真を大きく使う面。確認できている事実だけで構成する。
 *   ・鹿児島県指宿市山川で栽培している
 *   ・農園から直接届ける
 *   ・旬の時期にだけ出会える
 * 糖度・粒の大きさ・栽培方法などは未確認のため触れない。
 */
export default function OurLycheeSection() {
  return (
    <section className="grain bg-forest-deep text-cream">
      {/* 画面幅いっぱいの写真。
          手元の写真はすべて縦位置のため、横長の枠では中央が切り取られる。
          葉と実が画面全体に広がっている一枚を選び、帯として見せている。 */}
      <Reveal>
        <Photo
          src="/images/farm/lychee-trees.jpg"
          alt="ハウスで育つ山川園芸のライチの木"
          aspect="aspect-[4/3] md:aspect-[21/9]"
          sizes="100vw"
          quality={82}
          tone="forest"
        />
      </Reveal>

      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <Reveal>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-soft">
              Our lychee
            </p>
            <h2 className="mt-5 font-mincho text-[1.75rem] leading-[1.55] text-cream md:text-[2.3rem]">
              山川園芸の
              <br />
              ライチのこと
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-8 block h-px w-16 bg-cream/40"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6 text-[0.96rem] leading-[2.1] text-cream/85">
              <p>
                山川園芸があるのは、薩摩半島のいちばん南、
                {siteConfig.address.locality}
                山川。三方を海に囲まれた、風の通る土地です。
              </p>
              <p>
                ここでライチをはじめとする熱帯性の果樹を育てています。
                収穫できるのは旬のあいだだけ。穫れた実は、
                産地から直接みなさまのもとへお送りしています。
              </p>
            </div>

            <dl className="mt-10 divide-y divide-cream/12 border-y border-cream/12">
              {[
                {
                  term: "産地",
                  desc: "鹿児島県指宿市山川。薩摩半島の最南端にある農園です。",
                },
                {
                  term: "お届け",
                  desc: "農園から直接お送りします。間に市場や仲卸は入りません。",
                },
                {
                  term: "季節",
                  desc: "国内のライチが穫れるのは初夏のごく短い期間だけです。",
                },
              ].map((item) => (
                <div key={item.term} className="flex gap-6 py-5">
                  <dt className="w-16 shrink-0 font-mincho text-[0.9rem] tracking-[0.1em] text-lychee-soft">
                    {item.term}
                  </dt>
                  <dd className="text-[0.9rem] leading-[1.95] text-cream/80">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* 写真を2枚、大きさを変えて置く */}
        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-[1.3fr_1fr] md:gap-8">
          <Reveal>
            <Photo
              src="/images/lychee/lychee-on-tree.jpg"
              alt="木になっているライチの実"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 55vw, 100vw"
              tone="forest"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <Photo
              src="/images/guide/lychee-packing.jpg"
              alt="袋と箱に詰めた収穫後のライチ"
              aspect="aspect-[4/3] md:aspect-[3/4]"
              sizes="(min-width: 768px) 40vw, 100vw"
              tone="forest"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
