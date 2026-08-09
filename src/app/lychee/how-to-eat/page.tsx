import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import StepList, { type Step } from "@/components/guide/StepList";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの食べ方（/lychee/how-to-eat）
 *
 * 「ライチ 食べ方」「ライチ 皮 むき方」「ライチ 種」を1ページで受ける。
 * 保存の話は /lychee/storage に分けている（検索意図が違うため）。
 *
 * [写真TODO] 手順写真が撮れたら、下の STEPS の photo.src にパスを入れ、
 * <StepList showPhotos /> にすると写真付きの手順に変わる。
 *   public/images/guide/lychee-howto-step1.jpg  皮に爪を入れているところ
 *   public/images/guide/lychee-howto-step2.jpg  皮をむいているところ
 *   public/images/guide/lychee-howto-step3.jpg  むき終わった果肉と種
 */

const page = getGuidePage("how-to-eat")!;

export const metadata = buildGuideMetadata(page);

const STEPS: Step[] = [
  {
    title: "さっと洗う",
    body: "皮つきのまま流水で軽く洗います。皮をむいて食べるので、ごしごし洗う必要はありません。洗ったあとは水気を拭き取ってください。",
    photo: {
      src: null,
      alt: "ライチを洗っているところ",
      slot: "guide/lychee-howto-step1.jpg",
    },
  },
  {
    title: "ヘタのついていた側から皮をむく",
    body: "枝についていたほうの端に爪を立てると、皮に切れ目が入ります。そこから、みかんをむくように指で皮をはがしていきます。包丁は要りません。果汁が出るので、お皿の上でむくと安心です。",
    photo: {
      src: null,
      alt: "ライチの皮に爪を入れているところ",
      slot: "guide/lychee-howto-step2.jpg",
    },
  },
  {
    title: "白い果肉を食べる",
    body: "皮の内側にある、白く半透明の部分が果肉です。ここを食べます。皮は食べません。",
    photo: {
      src: null,
      alt: "皮をむいたライチの果肉",
      slot: "guide/lychee-howto-step3.jpg",
    },
  },
  {
    title: "中心の種を取り除く",
    body: "果肉の中心に、つやのある黒っぽい種がひとつ入っています。種は食べずに取り除いてください。果肉をかじりながら種を残すように食べると、手を汚さずに済みます。",
  },
];

export default function HowToEatPage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="ライチはどうやって食べますか？">
        <p>
          皮をむいて、中の白い果肉を食べます。包丁は使いません。
          ヘタのついていた側から爪を入れると皮に切れ目が入るので、
          あとはみかんのように指でむくだけです。
          中心に大きめの種がひとつあるので、種は取り除いてください。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>ライチはどこを食べる？</h2>
        <p>
          ライチは、外側から順に「皮」「果肉」「種」の3つでできています。
          このうち食べるのは、真ん中の白い果肉だけです。
        </p>
        <ul className="space-y-3">
          {[
            "皮 … 赤くてざらざらした外側。食べません。",
            "果肉 … 白く半透明のみずみずしい部分。ここを食べます。",
            "種 … 中心にあるつやのある種。食べません。",
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

        <h2>基本の食べ方（4つの手順）</h2>
      </div>

      <StepList steps={STEPS} />

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>生ライチの場合</h2>
        <p>
          冷蔵庫でよく冷やしてからむくと、みずみずしさを感じやすくなります。
          冷やす時間は特に決まりがありません。食べる前に冷蔵庫から出しておく、
          といった手間も要りません。
        </p>
        <p>
          皮をむいた瞬間に立ちのぼる香りは、生のライチならではのものです。
          むいてすぐに食べるのがいちばんおいしい食べ方です。
        </p>

        <h2>冷凍ライチの場合</h2>
        <p>
          凍ったままだと皮がむきにくいので、少し室温に置いてからむきます。
          完全に解凍せず、半解凍のままシャーベットのように食べる方法もあります。
        </p>
        <p>
          生のライチを買って食べきれないときも、皮つきのまま冷凍できます。
          やり方は
          <Link href="/lychee/storage">ライチの保存方法</Link>
          にまとめました。
        </p>

        <h2>よくある質問</h2>

        <h3>ライチの皮は食べられますか？</h3>
        <p>
          皮は食べません。かたくてざらざらしており、食用ではありません。
          手でむいて取り除いてください。
        </p>

        <h3>ライチの種は食べられますか？</h3>
        <p>
          種も食べません。取り除いてお召し上がりください。
          小さなお子様やご高齢の方が食べる際は、
          誤って飲み込まないよう、大人の方が種を取ってから
          お渡しいただくと安心です。
        </p>

        <h3>包丁で切ったほうがきれいにむけますか？</h3>
        <p>
          手でむくほうが簡単です。ライチの皮は薄く、
          ヘタのついていた側に爪を入れれば切れ目が入ります。
          包丁を使うと果汁が流れ出てしまうことがあります。
        </p>

        <h3>手が汚れませんか？</h3>
        <p>
          果汁が多いので、多少は手が濡れます。
          お皿の上でむく、キッチンペーパーを1枚用意しておく、
          といった準備をしておくと気になりません。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/storage">
              届いたライチの保存方法と日持ちを見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/taste">ライチはどんな味なのかを読む</Link>
          </li>
          <li>
            <Link href="/lychee/nutrition">
              ライチの栄養成分（公的データ）を見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/recipes">
              冷やす・凍らせるなど、ライチの楽しみ方を見る
            </Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
