import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチはどんな味？（/lychee/taste）
 *
 * ─────────────────────────────────────────────
 * 書くときの注意
 * ─────────────────────────────────────────────
 * ・「マスカットのような」「桃に似た」といった他の果物との断定比較はしない。
 *   人によって感じ方が違ううえ、根拠がない。
 * ・糖度の数値は、実測値を伺っていないので書かない。
 * ・[一次情報TODO] 品種ごとの味の違いを農園から伺えたら FarmNote を追加。
 *   このページはそれがあるかどうかで質が大きく変わる。
 */

const page = getGuidePage("taste")!;

export const metadata = buildGuideMetadata(page);

export default function TastePage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="ライチはどんな味がしますか？">
        <p>
          甘みがはっきりしていて、酸味は控えめです。
          いちばんの特徴は華やかな香りで、皮をむいた瞬間に立ちのぼります。
          果肉は白く半透明、みずみずしくて果汁が多く、
          やわらかいのに歯ごたえも少し残ります。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>甘み</h2>
        <p>
          甘みははっきりしています。
          後を引くような重い甘さではなく、
          みずみずしさと一緒にすっと入ってくる感じ方をします。
        </p>
        <p>
          ただし、甘みの強さは品種や収穫のタイミングによって変わります。
          同じ農園のものでも、時期によって印象が違うことがあります。
        </p>

        <h2>酸味</h2>
        <p>
          酸味は控えめです。
          柑橘のようにはっきりした酸っぱさはなく、
          甘さの後ろにわずかに感じる程度です。
        </p>

        <h2>香り</h2>
        <p>
          ライチの持ち味は、なんといっても香りです。
          皮をむいた瞬間に、花のような甘い香りが立ちのぼります。
        </p>
        <p>
          この香りの立ち方は、生のライチと冷凍のライチでいちばん差が出るところです。
          違いについては
          <Link href="/lychee/fresh-vs-frozen">
            生ライチと冷凍ライチの違い
          </Link>
          をご覧ください。
        </p>

        <h2>食感</h2>
        <p>
          果肉は白く半透明で、つるんとしています。
          やわらかいのですが、噛むとわずかに弾力があります。
          果汁が多く、ひと口噛むとあふれてくるほどです。
        </p>
        <p>
          冷凍したものを半解凍で食べると、
          シャーベットのような食感に変わります。
        </p>

        <h2>ほかの果物にたとえられますか</h2>
        <p>
          「○○に似ている」という説明をよく見かけますが、
          感じ方には個人差があります。
          このページでは、あえて他の果物にたとえずに書きました。
        </p>
        <p>
          はっきり言えるのは、香りが特徴的であること、
          果汁が多いこと、そして生と冷凍では印象が変わることです。
        </p>

        <h2>冷やすと味は変わりますか</h2>
        <p>
          冷蔵庫でよく冷やしてから食べると、
          みずみずしさを感じやすくなります。
          常温よりも冷やしたほうが、すっきりとした印象になります。
        </p>
        <p>
          食べ方は
          <Link href="/lychee/how-to-eat">ライチの食べ方</Link>
          にまとめています。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/fresh">生ライチとはどんな果物かを読む</Link>
          </li>
          <li>
            <Link href="/lychee/how-to-eat">
              ライチの皮のむき方と種の取り方を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/how-to-choose">
              おいしいライチの見分け方を読む
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
