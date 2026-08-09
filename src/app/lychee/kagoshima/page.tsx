import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import FarmNote from "@/components/guide/FarmNote";
import GuideLayout from "@/components/guide/GuideLayout";
import Photo from "@/components/ui/Photo";
import { getGuidePage } from "@/data/lycheeGuide";
import { lycheeVarieties, varietyNote } from "@/data/products";
import { salesStatus, siteConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * 鹿児島のライチ（/lychee/kagoshima）
 *
 * ─────────────────────────────────────────────
 * このページの役割
 * ─────────────────────────────────────────────
 * 一般論だけの記事にしないこと。
 * 「鹿児島県指宿市山川で実際にライチを育てている」という
 * 一次情報が、まとめサイトに対する唯一の差になる。
 *
 * 農園から新しい情報をもらったら、下の FarmNote と写真を増やしていく。
 * 「日本一」「最適な土地」など、根拠のない優位表現は書かない。
 */

const page = getGuidePage("kagoshima")!;

export const metadata = buildGuideMetadata(page);

export default function KagoshimaPage() {
  return (
    <GuideLayout
      page={page}
      farmNote={
        <FarmNote title="山川園芸のライチ">
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
            市場や仲卸を通さず、農園から直接お送りしています。
          </p>
        </FarmNote>
      }
    >
      <AnswerBox question="鹿児島でライチは作られていますか？">
        <p>
          作られています。鹿児島県は、国内でライチを栽培している数少ない地域のひとつです。
          冬の冷え込みがゆるやかな温暖な気候が、
          熱帯・亜熱帯の果樹を育てる前提になります。
        </p>
        <p className="mt-2">
          山川園芸は薩摩半島最南端の指宿市山川でライチを育て、
          旬のあいだだけ産地直送でお届けしています。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>鹿児島で熱帯果樹が育つ理由</h2>
        <p>
          ライチのような熱帯・亜熱帯の果樹にとって、いちばんこわいのは寒さです。
          冬の冷え込みがどれくらいかが、育てられるかどうかを分けます。
        </p>
        <p>
          鹿児島県は日本の南に位置し、比較的温暖な気候です。
          そのなかでも薩摩半島の南部は、三方を海に囲まれた土地が多く、
          海の影響で気温の変化がゆるやかになります。
        </p>
        <p>
          とはいえ、日本の冬はライチにとって十分暖かいわけではありません。
          ハウスを使って寒さから守りながら育てている農園もあります。
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Photo
          src="/images/lychee/lychee-on-tree.jpg"
          alt="鹿児島県指宿市の山川園芸で色づいたライチの実"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
        <Photo
          src="/images/farm/lychee-trees.jpg"
          alt="鹿児島県指宿市のハウスで育つライチの木"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>鹿児島のライチはいつ穫れる？</h2>
        <p>
          国内のライチは初夏から夏にかけてが収穫期で、
          産地や品種によって時期に幅があります。
          同じ農園のなかでも、品種ごとに熟す順番があります。
        </p>
        <p>
          山川園芸からお届けできるのは{salesStatus.seasonLabel}までです。
          くわしくは
          <Link href="/lychee/season">ライチの旬はいつ？</Link>
          をご覧ください。
        </p>

        <h2>鹿児島の生ライチはどこで買える？</h2>
        <p>
          店頭で見かけることはあまりなく、農園からの直送で買うのが一般的です。
          収穫できる期間が短いため、販売の時期も限られます。
        </p>
        <p>
          山川園芸では、オンラインショップから産地直送でお送りしています。
          このほか、南さつま市のPICO様の青果コーナーでもお取り扱いいただいています
          （取り扱い状況は時期によって変わります）。
        </p>

        <h2>鹿児島のフルーツとしてのライチ</h2>
        <p>
          鹿児島は温暖な気候を生かして、さまざまな果物が育てられている土地です。
          そのなかでもライチは、育てられる場所も収穫できる期間も限られる果物です。
        </p>
        <p>
          珍しいフルーツを探している方、
          お取り寄せで季節のものを楽しみたい方に向いています。
          贈り物として選ぶ場合の注意点は
          <Link href="/lychee/gift">ライチをギフトに</Link>
          にまとめました。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/ibusuki">
              指宿という土地とライチについて読む
            </Link>
          </li>
          <li>
            <Link href="/lychee/domestic">
              国産ライチの産地と輸入との違いを読む
            </Link>
          </li>
          <li>
            <Link href="/about">山川園芸について</Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
