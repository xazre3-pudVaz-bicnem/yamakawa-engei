import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの楽しみ方（/lychee/recipes）
 *
 * ─────────────────────────────────────────────
 * 書くときの注意
 * ─────────────────────────────────────────────
 * 作ったことのないレシピを分量つきで書かない。
 * ここは「こういう使い方ができます」という範囲にとどめ、
 * 実際に農園で試している食べ方を伺えたら FarmNote で追加する。
 *
 * [一次情報TODO] 泊さんのおすすめの食べ方を伺えたら、
 * このページの価値が大きく上がります。
 */

const page = getGuidePage("recipes")!;

export const metadata = buildGuideMetadata(page);

const WAYS = [
  {
    index: "01",
    title: "冷やして、そのまま",
    body: "いちばんおすすめです。冷蔵庫でよく冷やして、皮をむいてそのまま。手が汚れるくらいの果汁が出ます。生のライチの香りをいちばん感じられる食べ方です。",
  },
  {
    index: "02",
    title: "凍らせて、シャーベットのように",
    body: "皮つきのまま冷凍しておき、半解凍で食べます。しゃりっとした食感に変わり、夏らしい食べ方になります。凍らせておけば、旬が終わったあとも楽しめます。",
  },
  {
    index: "03",
    title: "スムージーやドリンクに",
    body: "皮と種を取ってミキサーへ。凍らせたものを使うと、氷を入れなくても冷たく仕上がります。炭酸水を注いでもさっぱりします。",
  },
  {
    index: "04",
    title: "デザートに添えて",
    body: "むいた果肉をヨーグルトやアイスに添えるだけでも、香りが移って印象が変わります。加熱せずに使うほうが、ライチらしい香りが残ります。",
  },
  {
    index: "05",
    title: "家族で、囲んで",
    body: "包丁もお皿も要りません。テーブルに出して、みんなでむきながら食べる。それがいちばん楽しい食べ方かもしれません。",
  },
];

export default function RecipesPage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="ライチはどうやって食べるのがおすすめですか？">
        <p>
          冷蔵庫でよく冷やして、そのまま食べるのがいちばんです。
          食べきれないときは皮つきのまま冷凍でき、
          半解凍でシャーベットのように食べたり、
          スムージーやデザートの材料にしたりできます。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>ライチの楽しみ方</h2>
        <p>
          むずかしい調理は要りません。
          そのまま食べるのを基本に、余ったときの使い道を知っておくと安心です。
        </p>
      </div>

      <ol className="mt-8 border-t border-ink/12">
        {WAYS.map((way) => (
          <li key={way.index} className="flex gap-5 border-b border-ink/12 py-7">
            <span
              aria-hidden="true"
              className="font-serif-en text-[0.78rem] tracking-[0.24em] text-lychee-deep"
            >
              {way.index}
            </span>
            <div>
              <h3 className="font-mincho text-[1.08rem] leading-[1.7] text-forest md:text-[1.2rem]">
                {way.title}
              </h3>
              <p className="mt-3 text-[0.93rem] leading-[2.05] text-ink/85">
                {way.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>加熱して使わないほうがいい？</h2>
        <p>
          ライチの持ち味は香りです。
          加熱すると香りが飛びやすいため、
          そのまま使う食べ方のほうが向いています。
        </p>

        <h2>食べきれないときは</h2>
        <p>
          生のまま冷蔵庫に置いておくと日持ちは長くありません。
          食べきれないと分かった時点で、皮つきのまま冷凍してしまうのが確実です。
        </p>
        <p>
          冷凍の仕方は
          <Link href="/lychee/storage">ライチの保存方法</Link>
          にまとめています。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/how-to-eat">
              ライチの皮のむき方と種の取り方を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/storage">
              冷蔵・冷凍の保存方法を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/taste">ライチはどんな味なのかを読む</Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
