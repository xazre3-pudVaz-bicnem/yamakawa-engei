import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/siteConfig";

/**
 * 贈り物としてのライチ
 *
 * 注意：ギフト包装・のし・メッセージカードの対応可否は未確認のため、
 * 「対応しています」とは書かない。確認が取れたら、この注記を
 * 実際のサービス内容に差し替えること。
 */
export default function GiftSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <Photo
              src="/images/products/lychee-tray.jpg"
              alt="トレイに並べた収穫したての生ライチ"
              aspect="aspect-[4/5] md:aspect-[5/6]"
              sizes="(min-width: 768px) 48vw, 100vw"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              As a gift
            </p>
            <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
              まだ食べたことのない人へ、
              <br />
              贈る夏のくだもの。
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
            />

            <div className="mt-8 space-y-6 text-[0.95rem] leading-[2.1] text-ink/85">
              <p>
                桃やメロンはもう贈られているかもしれません。
                けれど、生のライチを食べたことのある方は、まだそう多くありません。
              </p>
              <p>
                旬が短く、その時期にしか贈れないこと。
                皮をむくところから食卓の話題になること。
                夏のご挨拶や、ご家族への贈り物として選ばれています。
              </p>
            </div>

            <ul className="mt-9 space-y-3 border-t border-ink/12 pt-7 text-[0.9rem] leading-[1.9] text-ink/80">
              {[
                "夏のご挨拶・季節の贈り物に",
                "珍しいフルーツギフトをお探しの方に",
                "ご家族やお子さまと囲む食卓に",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-lychee/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* のし・ギフト包装は非対応。ギフト訴求のすぐそばに必ず明記する。 */}
            <p className="mt-7 border border-ink/12 bg-paper px-5 py-4 text-[0.83rem] leading-[1.9] text-moss">
              {siteConfig.giftWrapping.note}
              包装は、ジッパー付きの袋のほか、店頭販売と同じ包装にも対応しています。
              ご希望がありましたら、ご注文の際にお知らせください。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center border border-lychee bg-lychee px-8 py-3.5 text-[0.9rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
              >
                商品を見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
              >
                贈り物について相談する
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
