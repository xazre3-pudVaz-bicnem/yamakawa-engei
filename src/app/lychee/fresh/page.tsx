import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import FarmNote from "@/components/guide/FarmNote";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { salesStatus, siteConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * 生ライチとは（/lychee/fresh）
 *
 * 冷凍しか知らない人に「生ライチ」という状態を説明し、
 * 商品ページへ自然につなぐ役割のページ。
 *
 * 冷凍ライチを悪く言わないこと。状態が違うだけで、優劣の話ではない。
 */

const page = getGuidePage("fresh")!;

export const metadata = buildGuideMetadata(page);

export default function FreshPage() {
  return (
    <GuideLayout
      page={page}
      farmNote={
        <FarmNote title="産地から直接お送りしています">
          <p>
            山川園芸は{siteConfig.address.full}でライチを育てています。
            穫れた実は市場や仲卸を通さず、農園から直接お送りしています。
          </p>
          <p>
            お届けできるのは{salesStatus.seasonLabel}まで。
            生のライチは日もちが長くないため、
            産地から短い距離で届く形が向いている果物です。
          </p>
        </FarmNote>
      }
    >
      <AnswerBox question="生ライチとは何ですか？">
        <p>
          収穫した実を凍らせずに、そのままの状態でお届けするライチのことです。
          日本で流通しているライチの多くは冷凍のため、
          生の実に出会える期間はごく短くなります。
        </p>
        <p className="mt-2">
          いちばんの違いは、皮をむいたときに立ちのぼる香りと、
          果肉のみずみずしさです。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>「冷凍のライチしか食べたことがない」という方へ</h2>
        <p>
          スーパーの冷凍コーナーや、飲食店のデザートで見かけるライチ。
          日本で食べられているライチの多くは、収穫後に凍らせたものです。
        </p>
        <p>
          生のライチは、そもそも別の状態の果物だと思っていただいてかまいません。
          皮をむいた瞬間に香りが立ちのぼり、
          ひと口噛むと果汁があふれます。
        </p>
        <p>
          冷凍が劣っているという話ではありません。
          凍らせたまま食べるおいしさもあります。
          違いを比べたい方は
          <Link href="/lychee/fresh-vs-frozen">
            生ライチと冷凍ライチの違い
          </Link>
          をご覧ください。
        </p>

        <h2>生ライチが手に入りにくい理由</h2>
        <ul className="space-y-3">
          {[
            "ライチは熱帯・亜熱帯の果物で、国内で育てられる地域が限られています。",
            "収穫できる期間が短く、1年のうちわずかな時期しか穫れません。",
            "収穫後の日もちが長くないため、遠くまで運ぶのに向きません。",
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
          この3つが重なって、国産の生ライチは市場に出る量がとても少なくなります。
          産地から直接お取り寄せする形が現実的な買い方になるのは、
          このためです。
        </p>

        <h2>生ライチはどんな味？</h2>
        <p>
          甘みと控えめな酸味があり、香りが華やかです。
          果肉は白く半透明で、みずみずしい食感をしています。
        </p>
        <p>
          味わいについては
          <Link href="/lychee/taste">ライチはどんな味？</Link>
          でくわしく書きました。
        </p>

        <h2>生ライチの旬</h2>
        <p>
          国内で穫れる生のライチは、初夏から夏にかけてが収穫期です。
          産地や品種によって時期に幅があります。
          くわしくは
          <Link href="/lychee/season">ライチの旬はいつ？</Link>
          をご覧ください。
        </p>

        <h2>生ライチはどこで買える？</h2>
        <p>
          店頭に並ぶことはあまりなく、産地からの直送で買うのが一般的です。
          収穫できる期間が短いため、時期を逃すと翌年まで待つことになります。
        </p>
        <p>
          購入したあとの扱いは、生鮮食品と同じです。
          届いたら冷蔵庫に入れ、早めに召し上がってください。
          保存の仕方は
          <Link href="/lychee/storage">ライチの保存方法</Link>
          にまとめています。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/fresh-vs-frozen">
              生ライチと冷凍ライチの違いを比べる
            </Link>
          </li>
          <li>
            <Link href="/lychee/domestic">
              国産ライチの産地について読む
            </Link>
          </li>
          <li>
            <Link href="/lychee/how-to-eat">
              ライチの皮のむき方を見る
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
