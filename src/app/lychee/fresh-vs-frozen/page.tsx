import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import CompareTable from "@/components/guide/CompareTable";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * 生ライチと冷凍ライチの違い（/lychee/fresh-vs-frozen）
 *
 * ─────────────────────────────────────────────
 * 書くときの注意
 * ─────────────────────────────────────────────
 * 自社が生ライチを売っているからといって、冷凍を悪く書かないこと。
 * 読む人が自分で選べる材料を並べるのがこのページの役割。
 * 「冷凍は味が落ちる」といった断定もしない（保存状態で変わるため）。
 */

const page = getGuidePage("fresh-vs-frozen")!;

export const metadata = buildGuideMetadata(page);

export default function FreshVsFrozenPage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="生ライチと冷凍ライチは何が違いますか？">
        <p>
          いちばんの違いは「状態」です。生ライチは収穫した実をそのまま届けるもの、
          冷凍ライチは収穫後に凍らせたものです。
          そこから、香りの立ち方・食感・出回る時期・日持ちに差が生まれます。
        </p>
        <p className="mt-2">
          どちらが優れているという話ではなく、
          食べたい時期や食べ方によって向き不向きがあります。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>比較表</h2>
      </div>

      <CompareTable
        caption="生ライチと冷凍ライチの比較"
        columns={["生ライチ", "冷凍ライチ"]}
        rows={[
          {
            label: "状態",
            values: ["収穫したままの実", "収穫後に凍らせた実"],
          },
          {
            label: "香り",
            values: [
              "皮をむいた瞬間に立ちのぼる",
              "解凍の仕方によって感じ方が変わる",
            ],
          },
          {
            label: "食感",
            values: [
              "みずみずしく、果汁が多い",
              "解凍具合で変わる。半解凍ならシャーベットのよう",
            ],
          },
          {
            label: "出回る時期",
            values: ["収穫期のみ（初夏から夏）", "一年をとおして"],
          },
          {
            label: "日持ち",
            values: ["冷蔵で数日〜1週間ほど", "冷凍のまま長期間"],
          },
          {
            label: "買える場所",
            values: [
              "産地からの直送が中心。店頭ではあまり見かけない",
              "スーパー、輸入食品店など",
            ],
          },
          {
            label: "向いている食べ方",
            values: [
              "冷やしてそのまま",
              "凍ったまま、半解凍、デザートの材料に",
            ],
          },
        ]}
      />

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <p className="text-[0.85rem] text-moss">
          ※ 冷凍ライチの状態は、凍らせ方や保存の温度によって変わります。
          上の表は一般的な傾向としてお読みください。
        </p>

        <h2>生ライチが向いている場合</h2>
        <ul className="space-y-3">
          {[
            "生の果物としてのみずみずしさや香りを味わいたいとき。",
            "旬の時期に、季節の果物として楽しみたいとき。",
            "食べたことのない人への贈り物にしたいとき。",
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

        <h2>冷凍ライチが向いている場合</h2>
        <ul className="space-y-3">
          {[
            "季節を問わず、食べたいときに食べたいとき。",
            "凍ったままシャーベットのように食べたいとき。",
            "デザートやドリンクの材料として使いたいとき。",
            "少しずつ長く楽しみたいとき。",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-3.5 h-px w-4 shrink-0 bg-leaf/70"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2>生ライチを買って、あとから凍らせることもできます</h2>
        <p>
          生のライチを買って食べきれないときは、皮つきのまま冷凍できます。
          旬のうちに生で味わい、残りを凍らせて後から楽しむ、という食べ方もあります。
        </p>
        <p>
          冷凍の仕方は
          <Link href="/lychee/storage">ライチの保存方法</Link>
          にまとめました。
        </p>

        <h2>栄養に違いはありますか</h2>
        <p>
          文部科学省の食品成分データベースには「ライチー／生」の値が収載されており、
          冷凍したものの成分値は別に収載されていません。
          そのため、公的なデータで両者を数値どうし比べることはできません。
        </p>
        <p>
          生のライチの栄養成分は
          <Link href="/lychee/nutrition">ライチの栄養</Link>
          に掲載しています。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/fresh">生ライチとはどんな果物かを読む</Link>
          </li>
          <li>
            <Link href="/lychee/taste">ライチはどんな味なのかを読む</Link>
          </li>
          <li>
            <Link href="/lychee/how-to-eat">
              生・冷凍それぞれの食べ方を見る
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
