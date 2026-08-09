import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * 国産ライチとは（/lychee/domestic）
 *
 * ─────────────────────────────────────────────
 * 統計値についての注意（重要）
 * ─────────────────────────────────────────────
 * 「国産は流通量の○％」「収穫量は○トン」といった数字は、
 * 他サイトから転載しないこと。
 *
 * 載せる場合は、農林水産省「特産果樹生産動態等調査」（e-Stat で公開）
 * の最新年次を実際に確認し、年次と出典を明記したうえで
 * SourceList コンポーネントで参考資料を表示すること。
 * 現時点では一次資料で確認できた数値がないため、
 * 数字を出さずに事実関係だけを書いている。
 */

const page = getGuidePage("domestic")!;

export const metadata = buildGuideMetadata(page);

export default function DomesticPage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="国産ライチとは？どこで作られていますか？">
        <p>
          日本国内で栽培・収穫されたライチのことです。
          ライチは熱帯・亜熱帯の果物のため、栽培できる地域は限られており、
          鹿児島・宮崎・沖縄など温暖な地域で育てられています。
        </p>
        <p className="mt-2">
          輸入ライチの多くが冷凍で流通するのに対し、
          国産は生のまま産地から届くのが大きな違いです。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>国産ライチが少ない理由</h2>
        <p>
          ライチはもともと暖かい地域の果樹です。
          冬の冷え込みに弱いため、日本で育てられる場所は南のほうの限られた地域だけになります。
        </p>
        <p>
          加えて、実がなるまでに年数がかかること、
          収穫できる期間が短いこと、収穫後の日もちが長くないこと。
          これらが重なって、国産の生ライチは市場に出る量が少なくなっています。
        </p>

        <h2>国内でライチが栽培されている地域</h2>
        <p>
          国内でライチを栽培しているのは、鹿児島県・宮崎県・沖縄県といった
          温暖な地域が中心です。
          ハウスを使って寒さから守りながら育てている農園もあります。
        </p>
        <p>
          鹿児島県については
          <Link href="/lychee/kagoshima">鹿児島のライチ</Link>
          で、山川園芸のある指宿市については
          <Link href="/lychee/ibusuki">指宿とライチ・熱帯果樹</Link>
          でくわしく紹介しています。
        </p>

        <h2>輸入ライチとの違い</h2>
        <p>
          いちばん大きな違いは、届く状態です。
          海外から運ばれてくるライチは、輸送の時間が長いため冷凍されているものが多くなります。
          国産のライチは、収穫した実を生のまま産地から送ることができます。
        </p>
        <p>
          生と冷凍の違いは
          <Link href="/lychee/fresh-vs-frozen">
            生ライチと冷凍ライチの違い
          </Link>
          で比較表にまとめました。
        </p>

        <h2>国産ライチが出回る時期</h2>
        <p>
          国内のライチは初夏から夏にかけてが収穫期で、
          産地や品種によって6月下旬から8月ごろまで幅があります。
          店頭に並ぶことは少なく、産地からの直送で買うのが一般的です。
        </p>
        <p>
          時期について詳しくは
          <Link href="/lychee/season">ライチの旬はいつ？</Link>
          をご覧ください。
        </p>

        <h2>国産の生ライチはどこで買える？</h2>
        <p>
          栽培している農園が直接販売しているケースが中心です。
          収穫できる期間が短いため、販売の時期も限られます。
        </p>
        <p>
          山川園芸は鹿児島県指宿市山川でライチを育てており、
          旬のあいだだけ産地直送でお届けしています。
          <Link href="/lychee/fresh">生ライチとは</Link>
          もあわせてご覧ください。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/kagoshima">
              鹿児島のライチと、生ライチの買い方を読む
            </Link>
          </li>
          <li>
            <Link href="/lychee/season">
              国産ライチの旬と収穫時期を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/nutrition">
              ライチの栄養成分（公的データ）を見る
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
