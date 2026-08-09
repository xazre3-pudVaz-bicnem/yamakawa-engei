import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import Photo from "@/components/ui/Photo";
import { getGuidePage } from "@/data/lycheeGuide";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチの選び方（/lychee/how-to-choose）
 *
 * [一次情報TODO] 農園から「選果でどこを見ているか」を伺えたら、
 * FarmNote を追加してください。まとめサイトに最も差がつく部分です。
 * 例）ヘタの周りを見る、持ったときの重さで判断する、
 *     この品種はこういう色になる、など。
 */

const page = getGuidePage("how-to-choose")!;

export const metadata = buildGuideMetadata(page);

export default function HowToChoosePage() {
  return (
    <GuideLayout page={page}>
      <AnswerBox question="おいしいライチはどう選びますか？">
        <p>
          皮に張りがあり、手に持ったときに重みを感じるものを選びます。
          果皮の色は収穫からの時間で変わっていくため、
          茶色みがあるかどうかだけで判断しないのがポイントです。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>見るところは3つ</h2>

        <h3>1. 皮に張りがあるか</h3>
        <p>
          いちばん分かりやすいのが、皮の張りです。
          水分が抜けてくると皮がしぼんで、押したときにへこみやすくなります。
          ぴんとした張りのあるものを選んでください。
        </p>

        <h3>2. 手に持って重みを感じるか</h3>
        <p>
          同じくらいの大きさなら、重いほうが果汁を多く含んでいます。
          いくつか手に取って比べてみると違いが分かります。
        </p>

        <h3>3. 傷や割れがないか</h3>
        <p>
          皮が割れているもの、汁がにじんでいるものは避けます。
          そこから傷みが進みやすくなります。
        </p>
      </div>

      <div className="mt-12">
        <Photo
          src="/images/products/lychee-tray.jpg"
          alt="収穫したての生ライチをトレイに並べたところ"
          aspect="aspect-[16/10]"
          sizes="(min-width: 768px) 60vw, 100vw"
        />
      </div>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>果皮の色で判断しないほうがいい理由</h2>
        <p>
          ライチの果皮は、収穫してから時間がたつにつれて
          赤みが抜け、茶色っぽく変わっていきます。
          これは乾燥によって起こる変化です。
        </p>
        <p>
          つまり果皮の色は「品質」というより「収穫からの時間」を表しています。
          少し茶色みがあっても、皮に張りがあって重みを感じるなら、
          中の果肉はみずみずしいままのことがあります。
        </p>
        <p>
          反対に、赤くても皮がしぼんでいるものは水分が抜けています。
          色だけでなく、張りと重さをあわせて見てください。
        </p>

        <h2>品種によって見た目は変わります</h2>
        <p>
          ライチには複数の品種があり、実の大きさや色づき方が異なります。
          「この色でなければおいしくない」という決まった基準はありません。
        </p>
        <p>
          山川園芸で育てている品種については
          <Link href="/lychee/kagoshima">鹿児島のライチ</Link>
          に記載しています。
        </p>

        <h2>買ったあとにすること</h2>
        <p>
          選んだライチは、できるだけ早く冷蔵庫に入れてください。
          むき出しのままだと乾燥が進むので、
          袋か保存容器に入れてから冷蔵庫へ。
        </p>
        <p>
          くわしくは
          <Link href="/lychee/storage">ライチの保存方法</Link>
          をご覧ください。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/storage">
              ライチの保存方法と日持ちを見る
            </Link>
          </li>
          <li>
            <Link href="/lychee/taste">ライチはどんな味なのかを読む</Link>
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
