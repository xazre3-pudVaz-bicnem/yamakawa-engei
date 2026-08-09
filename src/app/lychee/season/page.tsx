import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import FarmNote from "@/components/guide/FarmNote";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { lycheeVarieties, varietyNote } from "@/data/products";
import { salesStatus } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの旬（/lychee/season）
 *
 * ─────────────────────────────────────────────
 * 書くときの注意
 * ─────────────────────────────────────────────
 * 「一般的なライチの旬」と「山川園芸のお届け時期」を混ぜないこと。
 * 山川園芸の時期は siteConfig の salesStatus.seasonLabel から読んでいるので、
 * 本文に直接「7月〜」などと書かない（設定を変えても本文が古いままになる）。
 */

const page = getGuidePage("season")!;

export const metadata = buildGuideMetadata(page);

export default function SeasonPage() {
  return (
    <GuideLayout
      page={page}
      farmNote={
        <FarmNote title="山川園芸のライチの時期">
          <p>
            山川園芸からライチをお届けできるのは、{salesStatus.seasonLabel}
            までです。収穫の時期によって品種が変わり、
            {lycheeVarieties
              .map((group) => `${group.period}は${group.names.join("・")}`)
              .join("、")}
            を収穫しています。
          </p>
          <p>{varietyNote}</p>
          <p className="text-[0.85rem] text-moss">
            ※ その年の天候によって、収穫の時期は前後します。
            最新の状況は
            <Link
              href="/shop"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              オンラインショップ
            </Link>
            でご確認ください。
          </p>
        </FarmNote>
      }
    >
      <AnswerBox question="ライチの旬はいつですか？">
        <p>
          国内で育つライチの収穫期は初夏から夏にかけてで、
          産地や品種によって6月下旬から8月ごろまで幅があります。
          収穫できる期間が短く、収穫後の日もちも長くないため、
          生のライチが出回るのは1年のうちごくわずかな期間です。
        </p>
        <p className="mt-2">
          山川園芸からお届けできるのは{salesStatus.seasonLabel}までです。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>国産ライチの旬は初夏から夏</h2>
        <p>
          ライチはもともと暖かい地域で育つ果物です。
          日本では鹿児島・宮崎・沖縄など南のほうの地域で栽培されていて、
          初夏から真夏にかけて実が色づきます。
        </p>
        <p>
          収穫の時期は、産地の気候と育てている品種によって変わります。
          早い品種は6月下旬ごろから、遅い品種は8月ごろまで。
          同じ農園のなかでも、品種ごとに熟す順番があります。
        </p>

        <h2>輸入ライチはいつ出回る？</h2>
        <p>
          スーパーで一年じゅう見かけるライチの多くは、
          海外で収穫して冷凍したものです。
          冷凍であれば時期を問わず流通するため、旬という考え方があまり当てはまりません。
        </p>
        <p>
          一方、生のライチは「穫れたときにだけある」果物です。
          この違いについては
          <Link href="/lychee/fresh-vs-frozen">
            生ライチと冷凍ライチの違い
          </Link>
          で詳しく比べています。
        </p>

        <h2>どうして旬がこんなに短いのか</h2>
        <p>理由はふたつあります。</p>
        <ul className="space-y-3">
          {[
            "実が熟すタイミングがそろっていて、収穫できる期間そのものが短いこと。",
            "収穫したあとの日もちが長くなく、遠くまで運ぶのに向かないこと。",
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
          ライチは収穫すると果皮の色が変わりやすい果物です。
          だからこそ、産地から直接、短い距離でお届けする形が向いています。
        </p>

        <h2>旬を逃さないために</h2>
        <p>
          生のライチは、気づいたときには終わっていることの多い果物です。
          時期が近づいたら、産地の販売状況をこまめに見ておくのがおすすめです。
        </p>
        <ul className="space-y-3">
          <li>
            <Link href="/shop">
              山川園芸の今年の販売状況を見る
            </Link>
          </li>
          <li>
            <Link href="/news">販売開始のお知らせを見る</Link>
          </li>
        </ul>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/domestic">
              国産ライチの産地と輸入との違いを読む
            </Link>
          </li>
          <li>
            <Link href="/lychee/fresh">生ライチとはどんな果物かを読む</Link>
          </li>
          <li>
            <Link href="/lychee/kagoshima">鹿児島のライチについて読む</Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
