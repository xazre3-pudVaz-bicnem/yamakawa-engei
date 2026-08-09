import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import SourceList from "@/components/guide/SourceList";
import { getGuidePage } from "@/data/lycheeGuide";
import {
  nutrientGroupLabel,
  nutrientNotes,
  nutrients,
  nutritionReferences,
  nutritionSource,
  wasteRate,
  type NutrientRow,
} from "@/data/nutrition";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの栄養（/lychee/nutrition）
 *
 * ─────────────────────────────────────────────
 * このページを直すときの注意（重要）
 * ─────────────────────────────────────────────
 * 栄養は健康情報（YMYL）にあたる。
 *
 * ・数値はすべて data/nutrition.ts から読んでいる。
 *   本文に数字を直接書かないこと（表と本文がずれる原因になる）。
 * ・「美肌になる」「免疫力が上がる」「貧血が治る」「病気を防ぐ」など、
 *   効果を断定する表現は書かない。
 * ・「○○の働きに関わる栄養素です」という書き方に留める。
 * ・出典のない数字は載せない。参考資料の欄を必ず残すこと。
 */

const page = getGuidePage("nutrition")!;

export const metadata = buildGuideMetadata(page);

/** 栄養素の値を data から引く（本文に数字をベタ書きしないため） */
function value(name: string): string {
  const row = nutrients.find((item) => item.name === name);
  return row ? `${row.value}${row.unit}` : "—";
}

function NutrientTable({ group }: { group: NutrientRow["group"] }) {
  const rows = nutrients.filter((row) => row.group === group);

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-left text-[0.9rem]">
        <caption className="sr-only">
          ライチ（生）可食部100gあたりの{nutrientGroupLabel[group]}
        </caption>
        <thead>
          <tr className="border-y border-ink/15">
            <th scope="col" className="py-3.5 pr-6 font-normal text-moss">
              成分
            </th>
            <th scope="col" className="py-3.5 text-right font-normal text-moss">
              可食部100gあたり
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/12">
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row" className="py-3.5 pr-6 font-normal">
                {row.name}
              </th>
              <td className="tnum py-3.5 text-right">
                {row.value}
                <span className="ml-1 text-[0.8rem] text-moss">{row.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NutritionPage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="ライチにはどんな栄養が含まれていますか？">
        <p>
          ライチ（生）は可食部100gあたり{value("エネルギー")}で、
          ビタミンC {value("ビタミンC")}、葉酸 {value("葉酸")}、
          カリウム {value("カリウム")}を含みます。
          水分が{value("水分")}と多く、果物のなかでは葉酸が比較的多いのが特徴です。
        </p>
        <p className="mt-2 text-[0.85rem] text-moss">
          数値はすべて{nutritionSource.name}（{nutritionSource.edition}）
          によります。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>ライチ（生）の栄養成分表</h2>
        <p>
          文部科学省の食品成分データベースに収載されている
          「{nutritionSource.itemName}」の値です。
          すべて可食部100gあたりで、皮と種を除いた果肉の量を指します。
        </p>
        <p>
          なお同データベースでは、ライチの廃棄率（皮と種の割合）は
          {wasteRate.value}
          {wasteRate.unit}とされています。
          皮つきの状態で100gを買った場合、食べられる部分はそれより少なくなります。
        </p>

        <h3>エネルギーと主な成分</h3>
        <NutrientTable group="basic" />

        <h3>無機質（ミネラル）</h3>
        <NutrientTable group="mineral" />

        <h3>ビタミン</h3>
        <NutrientTable group="vitamin" />

        <p className="text-[0.85rem] text-moss">
          ※「Tr」は微量に含まれることを表す成分表の表記です。
          表に載せていない成分は、食品成分データベースでご確認いただけます。
        </p>

        <h2>ライチに多く含まれる栄養素</h2>
        <p>
          表のなかから、ライチの特徴といえる栄養素を取り上げます。
          栄養素の働きは体のしくみに関わる一般的な説明であり、
          ライチを食べることで特定の効果が得られるという意味ではありません。
        </p>
      </div>

      {/* 栄養素の説明。効果効能を断定しない書き方を data 側で担保している */}
      <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/12">
        {nutrientNotes.map((note) => (
          <div key={note.name} className="py-7">
            <dt className="flex flex-wrap items-baseline gap-x-4">
              <span className="font-mincho text-[1.1rem] text-forest">
                {note.name}
              </span>
              <span className="tnum text-[0.85rem] text-lychee-deep">
                100gあたり {note.amount}
              </span>
            </dt>
            <dd className="mt-3 text-[0.93rem] leading-[2.05] text-ink/85">
              {note.body}
            </dd>
          </div>
        ))}
      </dl>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>カロリーと糖質について</h2>
        <p>
          ライチ（生）のエネルギーは可食部100gあたり{value("エネルギー")}です。
          炭水化物は{value("炭水化物")}で、そのうち食物繊維総量が
          {value("食物繊維総量")}を占めます。
        </p>
        <p>
          「糖質」は成分表に独立した項目としては載っていないため、
          炭水化物から食物繊維を差し引いた値で示されることが一般的です。
          本ページでは、成分表に載っている項目をそのまま掲載しています。
        </p>

        <h2>生のライチと冷凍ライチで栄養は変わりますか</h2>
        <p>
          食品成分データベースに収載されているのは「ライチー／生」の値で、
          冷凍したものの成分値は別に収載されていません。
          そのため本ページの数値は、生の状態のものとしてお読みください。
        </p>
        <p>
          生と冷凍では、味わいや食感の感じ方が変わります。
          違いについては
          <Link href="/lychee/fresh-vs-frozen">
            生ライチと冷凍ライチの違い
          </Link>
          で比べています。
        </p>

        <h2>ライチを食べるときに気をつけたいこと</h2>
        <ul className="space-y-3">
          {[
            "中心に大きめの種があります。小さなお子様やご高齢の方がお召し上がりの際は、誤って飲み込まないようご注意ください。",
            "果物ですので、食べる量はほかの食品との組み合わせを見ながらお決めください。",
            "食物アレルギーが心配な方は、かかりつけの医師にご相談ください。",
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

        <h2>次に読む</h2>
        <p>
          栄養を知ったあとは、実際の食べ方と保存の仕方を見ておくと安心です。
        </p>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/how-to-eat">
              ライチの皮のむき方と種の取り方を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/storage">
              ライチの保存方法と日持ちの目安を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/fresh">生ライチとはどんな果物かを読む</Link>
          </li>
        </ul>
      </div>

      <div className="mt-16">
        <SourceList
          items={nutritionReferences}
          checkedAt={nutritionSource.checkedAt}
        />
      </div>
    </GuideLayout>
  );
}
