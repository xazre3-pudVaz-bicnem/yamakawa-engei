import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import { isBuyable, visibleProducts, type Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * 取り扱っている果物（TOPページ）
 *
 * ─────────────────────────────────────────────
 * ねらい
 * ─────────────────────────────────────────────
 * 「山川園芸＝ライチだけ」と見えないようにするための節。
 * 何を扱っていて、いま買えるのはどれなのかを、
 * ファーストビューのすぐ下で一目で分かるようにする。
 *
 * 並べる中身は data/products.ts から作る。
 * 商品を足せばここにも出るので、このファイルに商品を書かない。
 * 売り切れ・販売準備中のものも、隠さずに状態を添えて並べる
 * （扱っている品目そのものを知ってもらうため）。
 */
/** いま買えるものを先に、次に販売準備中、最後に売り切れを並べる */
function order(product: Product): number {
  if (isBuyable(product)) return 0;
  if (product.availability === "coming_soon") return 1;
  return 2;
}

export default function LineupSection() {
  if (visibleProducts.length === 0) return null;

  const lineup = [...visibleProducts].sort((a, b) => order(a) - order(b));

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
      <Reveal className="max-w-2xl">
        <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
          Lineup
        </p>
        <h2 className="mt-5 font-mincho text-[1.6rem] leading-[1.55] text-forest md:text-[2rem]">
          指宿・山川から、
          <br className="hidden sm:block" />
          季節の南国フルーツを。
        </h2>
        <span
          aria-hidden="true"
          className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
        />
        <p className="mt-7 text-[0.93rem] leading-[2.05] text-moss">
          冬の冷え込みがゆるやかな指宿市山川では、南国の果樹が育ちます。
          収穫できる時期がそれぞれ違うので、季節ごとに穫れたものをお届けしています。
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-x-8">
        {lineup.map((product, index) => (
          <Reveal as="li" key={product.slug} delay={index * 0.05}>
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="relative">
                <Photo
                  src={product.images[0]?.src ?? null}
                  alt={product.images[0]?.alt ?? product.name}
                  slot={product.images[0]?.slot}
                  aspect="aspect-[4/5]"
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                  tone="leaf"
                />
                <span className="absolute left-3 top-3">
                  <StatusBadge
                    status={product.availability}
                    className="bg-paper/95 backdrop-blur-[2px]"
                  />
                </span>
              </div>

              <h3 className="mt-5 font-mincho text-[1.05rem] leading-snug text-forest underline-offset-4 group-hover:underline">
                {product.shortName}
              </h3>

              <p className="mt-2 text-[0.82rem] leading-[1.8] text-moss">
                {product.volume}
                {product.shippingSchedule
                  ? `／${product.shippingSchedule.replace("のお届けです。", "")}`
                  : ""}
              </p>

              <p className="tnum mt-3 font-mincho text-[1.1rem] text-ink">
                {formatPrice(product.price) ?? "価格は準備中"}
                <span className="ml-1 text-[0.72rem] text-moss">税込</span>
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-14" delay={0.1}>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
          >
            オンラインショップを見る
          </Link>
          <Link
            href="/fruits"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
          >
            育てている果物について
          </Link>
        </div>
        <p className="mt-5 text-[0.8rem] leading-[1.9] text-moss">
          送料は別途かかります。すべて60サイズのクール宅急便（冷蔵）で、
          保冷バッグと保冷剤をお入れしてお届けします。
        </p>
      </Reveal>
    </section>
  );
}
