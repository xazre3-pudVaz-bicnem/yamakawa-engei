import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import FarmNote from "@/components/guide/FarmNote";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { getProduct } from "@/data/products";
import { shippingConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの保存方法（/lychee/storage）
 *
 * 山川園芸の商品についての記載は、商品データ（data/products.ts）の
 * storage / shippingMethod をそのまま参照している。
 * 商品側を更新すればこのページも自動的に一致するので、
 * 本文に山川園芸独自の保存方法を書き足さないこと。
 */

const page = getGuidePage("storage")!;

export const metadata = buildGuideMetadata(page);

export default function StoragePage() {
  const lychee = getProduct("nama-lychee-500g");

  return (
    <GuideLayout
      page={page}
      farmNote={
        lychee?.storage ? (
          <FarmNote title="山川園芸のライチが届いたら">
            <p>{lychee.storage}</p>
            {lychee.shippingMethod && <p>{lychee.shippingMethod}</p>}
            <p className="text-[0.85rem] text-moss">
              {shippingConfig.note}
            </p>
          </FarmNote>
        ) : undefined
      }
    >
      <AnswerBox question="ライチはどうやって保存しますか？">
        <p>
          冷蔵庫で保存します。乾燥すると果皮の色が変わりやすいため、
          ジッパー付きの袋や保存容器に入れてから冷蔵庫へ入れてください。
          日持ちの目安は数日から1週間ほどです。
          食べきれない分は、皮つきのまま冷凍できます。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>届いたら、まず何をする？</h2>
        <p>
          箱から出して、冷蔵庫に入れてください。
          常温に置いたままにすると、果皮の色が早く変わっていきます。
        </p>
        <p>
          このとき、袋や保存容器に入れてから冷蔵庫へ入れるのが大切です。
          ライチは乾燥に弱く、むき出しのまま冷蔵庫に入れると
          果皮から水分が抜けてしまいます。
        </p>

        <h2>冷蔵で保存する</h2>
        <ul className="space-y-3">
          {[
            "ジッパー付きの袋や、ふたのある保存容器に入れる。",
            "洗わずに、皮つきのまま入れる（洗うのは食べる直前で構いません）。",
            "冷蔵庫の野菜室、または冷蔵室に置く。",
            "数日から1週間ほどを目安に食べきる。",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          日持ちは、収穫からの日数や保存の状態によって変わります。
          生鮮食品ですので、届いたらできるだけ早くお召し上がりください。
        </p>

        <h2>冷凍で保存する</h2>
        <p>
          食べきれないときは、皮つきのまま冷凍できます。
          洗って水気を拭き、袋に入れて冷凍庫へ入れてください。
        </p>
        <p>
          凍らせたものは、半解凍でシャーベットのように食べられます。
          皮と種を取ってからミキサーにかければ、
          スムージーやデザートの材料としても使えます。
        </p>
        <p>
          解凍したあとの食感は、生のときとは変わります。
          そのままの食感を楽しみたい場合は、
          冷蔵のうちに食べきるのがおすすめです。
        </p>

        <h2>常温に置いてもいい？</h2>
        <p>
          長く置くのは向きません。ライチは収穫後に果皮の色が変わりやすく、
          気温が高いほどその変化が早くなります。
          夏場に届く果物ですので、受け取ったら冷蔵庫へ入れてください。
        </p>

        <h2>皮が茶色くなってきたら</h2>
        <p>
          ライチの果皮は、時間がたつと赤みが抜けて茶色っぽくなっていきます。
          これは乾燥によって起こる変化で、
          色が変わったからといってすぐに食べられなくなるわけではありません。
        </p>
        <p>
          ただし、果肉から酸っぱいにおいがする、汁が出ている、
          カビが見えるといった場合は食べずに処分してください。
          判断に迷うときは、無理に召し上がらないようにしてください。
        </p>

        <h2>保存するときの注意</h2>
        <ul className="space-y-3">
          {[
            "むき出しのまま冷蔵庫に入れると乾燥が進みます。必ず袋か容器に入れてください。",
            "皮をむいたあとの果肉は日持ちしません。むいたら早めに食べきってください。",
            "冷凍したものを室温で長く放置しないでください。",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-3.5 h-px w-4 shrink-0 bg-ink/25"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/how-to-eat">
              ライチの皮のむき方と種の取り方を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/recipes">
              凍らせたライチの楽しみ方を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/how-to-choose">
              新鮮なライチの見分け方を読む
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
