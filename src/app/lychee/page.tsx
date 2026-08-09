import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import FarmNote from "@/components/guide/FarmNote";
import Photo from "@/components/ui/Photo";
import {
  getGuidePage,
  guideChildren,
  guidePath,
} from "@/data/lycheeGuide";
import { nutritionSource, nutrients } from "@/data/nutrition";
import { lycheeVarieties, varietyNote } from "@/data/products";
import { salesStatus, siteConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチ完全ガイド（/lychee）— ピラーページ
 *
 * ─────────────────────────────────────────────
 * このページの役割
 * ─────────────────────────────────────────────
 * 「ライチ」で調べに来た人を受け止め、
 * それぞれの疑問に対応する詳細ページへ渡すハブ。
 *
 * ここで各テーマを書き切らないこと。
 * 深い話は詳細ページの仕事で、このページはあくまで案内役。
 * 詳細ページと同じ内容を書くと、検索意図が重なって共倒れになる。
 *
 * 目次は data/lycheeGuide.ts から自動生成しているので、
 * ページを追加すればここにも自動的に載る。
 */

const page = getGuidePage("")!;

export const metadata = buildGuideMetadata(page);

/** 本文に数字をベタ書きしないため、栄養値は data から引く */
function nutrient(name: string): string {
  const row = nutrients.find((item) => item.name === name);
  return row ? `${row.value}${row.unit}` : "—";
}

export default function LycheeGuidePage() {
  return (
    <GuideLayout
      page={page}
      farmNote={
        <FarmNote title="このガイドを書いている農園について">
          <p>
            山川園芸は{siteConfig.address.full}にある農園です。
            ハウスでライチをはじめとする熱帯性の果樹を育てています。
          </p>
          <p>
            収穫の時期によって品種が変わり、
            {lycheeVarieties
              .map((group) => `${group.period}は${group.names.join("・")}`)
              .join("、")}
            を収穫しています。{varietyNote}
          </p>
          <p>
            お届けできるのは{salesStatus.seasonLabel}まで。
            穫れた実は市場や仲卸を通さず、農園から直接お送りしています。
          </p>
        </FarmNote>
      }
    >
      <AnswerBox question="ライチとはどんな果物ですか？">
        <p>
          ライチは、暖かい地域で育つ果物です。
          赤くてざらざらした皮の中に白く半透明の果肉があり、中心に種がひとつ入っています。
          甘みがはっきりしていて、皮をむいた瞬間に華やかな香りが立ちのぼるのが特徴です。
        </p>
        <p className="mt-2">
          国内では鹿児島・宮崎・沖縄など温暖な地域で栽培され、
          初夏から夏にかけて収穫されます。
        </p>
      </AnswerBox>

      {/* ================= 目次 ================= */}
      <nav
        aria-labelledby="guide-toc"
        className="mt-12 border border-ink/12 bg-paper-warm px-6 py-7 md:px-8"
      >
        <h2
          id="guide-toc"
          className="font-mincho text-[1.1rem] tracking-[0.04em] text-forest"
        >
          このガイドの目次
        </h2>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {guideChildren.map((item) => (
            <li key={item.slug}>
              <Link
                href={guidePath(item.slug)}
                className="text-[0.9rem] text-forest underline-offset-4 hover:text-lychee-deep hover:underline"
              >
                {item.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ================= 本文 ================= */}
      <div className="prose-farm mt-14 text-[0.95rem] text-ink/85">
        <h2>ライチとは</h2>
        <p>
          ライチは、暖かい地域で育つ果物です。漢字では「茘枝」と書きます。
          木になった実を房ごと収穫し、皮をむいて中の果肉を食べます。
        </p>
        <p>
          日本では鹿児島・宮崎・沖縄など南のほうの地域で栽培されています。
          冬の冷え込みに弱いため、育てられる地域が限られる果樹です。
        </p>

        <h3>見た目・皮・果肉・種</h3>
        <ul className="space-y-3">
          {[
            "皮 … 赤くてざらざらした外側。食べません。",
            "果肉 … 白く半透明の部分。ここを食べます。果汁が多く、やわらかい食感です。",
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

        <h3>どんな味？</h3>
        <p>
          甘みがはっきりしていて、酸味は控えめ。
          いちばんの特徴は華やかな香りです。
          果肉はみずみずしく、噛むとわずかに弾力があります。
        </p>
        <p>
          <Link href="/lychee/taste">
            ライチの味・香り・食感をくわしく読む
          </Link>
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Photo
          src="/images/lychee/lychee-on-tree.jpg"
          alt="鹿児島県指宿市の山川園芸で木になっているライチの実"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
        <Photo
          src="/images/lychee/lychee-in-hand.jpg"
          alt="手に持った生ライチ一粒。大きさが分かる写真"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>

      <div className="prose-farm mt-14 text-[0.95rem] text-ink/85">
        <h2>ライチの旬</h2>
        <p>
          国内で育つライチの収穫期は初夏から夏にかけてで、
          産地や品種によって6月下旬から8月ごろまで幅があります。
          収穫できる期間が短く、収穫後の日もちも長くないため、
          生のライチが出回るのはごく限られた期間です。
        </p>
        <p>
          <Link href="/lychee/season">
            ライチの旬と収穫時期をくわしく読む
          </Link>
        </p>

        <h2>国産ライチと輸入ライチ</h2>
        <p>
          スーパーで一年じゅう見かけるライチの多くは、
          海外で収穫して冷凍したものです。
          国産のライチは栽培地域が限られる一方、
          生のまま産地から届けられるという違いがあります。
        </p>
        <p>
          <Link href="/lychee/domestic">
            国産ライチの産地と輸入との違いを読む
          </Link>
        </p>

        <h2>生ライチとは</h2>
        <p>
          収穫した実を凍らせずに、そのままの状態で届けるライチのことです。
          日本で流通しているライチの多くは冷凍のため、
          生の実に出会える期間はごく短くなります。
        </p>
        <p>
          <Link href="/lychee/fresh">生ライチとは何かを読む</Link>
          ／
          <Link href="/lychee/fresh-vs-frozen">
            生と冷凍の違いを比較表で見る
          </Link>
        </p>

        <h2>ライチの栄養</h2>
        <p>
          ライチ（生）は可食部100gあたり{nutrient("エネルギー")}で、
          ビタミンC {nutrient("ビタミンC")}、葉酸 {nutrient("葉酸")}、
          カリウム {nutrient("カリウム")}を含みます。
          水分が{nutrient("水分")}と多いのも特徴です。
        </p>
        <p className="text-[0.85rem] text-moss">
          数値は{nutritionSource.name}（{nutritionSource.edition}）によります。
        </p>
        <p>
          <Link href="/lychee/nutrition">
            ライチの栄養成分表と栄養素の説明を見る
          </Link>
        </p>

        <h2>ライチの食べ方</h2>
        <p>
          皮をむいて、中の白い果肉を食べます。包丁は要りません。
          ヘタのついていた側から爪を入れると皮に切れ目が入るので、
          あとはみかんのように指でむくだけです。
          中心に種があるので、取り除いてお召し上がりください。
        </p>
        <p>
          <Link href="/lychee/how-to-eat">
            ライチの皮のむき方を手順で見る
          </Link>
          ／
          <Link href="/lychee/recipes">
            冷やす・凍らせるなどの楽しみ方を見る
          </Link>
        </p>

        <h2>ライチの保存方法</h2>
        <p>
          冷蔵庫で保存します。乾燥すると果皮の色が変わりやすいため、
          袋や保存容器に入れてから冷蔵庫へ。
          日持ちの目安は数日から1週間ほどです。
          食べきれない分は、皮つきのまま冷凍できます。
        </p>
        <p>
          <Link href="/lychee/storage">
            ライチの保存方法と日持ちをくわしく読む
          </Link>
        </p>

        <h2>おいしいライチの選び方</h2>
        <p>
          皮に張りがあり、手に持ったときに重みを感じるものを選びます。
          果皮の色は収穫からの時間で変わっていくため、
          色だけで判断しないのがポイントです。
        </p>
        <p>
          <Link href="/lychee/how-to-choose">
            新鮮なライチの見分け方を読む
          </Link>
        </p>

        <h2>鹿児島・指宿とライチ</h2>
        <p>
          鹿児島県は、国内でライチを栽培している数少ない地域のひとつです。
          山川園芸のある指宿市山川は薩摩半島の南端にあり、
          三方を海に囲まれた温暖な土地です。
        </p>
        <p>
          <Link href="/lychee/kagoshima">鹿児島のライチについて読む</Link>
          ／
          <Link href="/lychee/ibusuki">
            指宿という土地と熱帯果樹について読む
          </Link>
        </p>

        <h2>ライチを贈り物にする</h2>
        <p>
          食べたことのある方が少なく、旬が短い果物なので、
          夏のご挨拶や季節の贈り物として選ばれています。
          贈る前に確かめておきたいこともあります。
        </p>
        <p>
          <Link href="/lychee/gift">
            ライチをギフトに贈るときのポイントを読む
          </Link>
        </p>

        <h2>生ライチはどこで買える？</h2>
        <p>
          店頭に並ぶことは少なく、産地からの直送で買うのが一般的です。
          山川園芸では、鹿児島県指宿市山川の農園から
          旬のあいだだけ産地直送でお届けしています。
        </p>
      </div>
    </GuideLayout>
  );
}
