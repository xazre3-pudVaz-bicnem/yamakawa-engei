import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import FarmNote from "@/components/guide/FarmNote";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { siteConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * 指宿とライチ・熱帯果樹（/lychee/ibusuki）
 *
 * ローカルSEOの受け皿。山川園芸だから書けるページにする。
 * 「指宿が日本一」「最適な土地」といった根拠のない表現は書かない。
 * 地理的な事実（薩摩半島の南端、三方を海に囲まれている）に留める。
 */

const page = getGuidePage("ibusuki")!;

export const metadata = buildGuideMetadata(page);

export default function IbusukiPage() {
  return (
    <GuideLayout
      page={page}
      farmNote={
        <FarmNote title="指宿市山川で育てています">
          <p>
            山川園芸の所在地は{siteConfig.address.full}です。
            ライチをはじめとする熱帯性の果樹を育てています。
          </p>
          <p>
            直売・見学は、事前にご連絡いただければ対応しています。
            ライチ狩りができるかどうかは時期によって変わりますので、
            あわせて
            <Link
              href="/access"
              className="mx-1 text-lychee-deep underline underline-offset-4"
            >
              農園・アクセス
            </Link>
            をご確認ください。
          </p>
        </FarmNote>
      }
    >
      <AnswerBox question="指宿でライチは育てられていますか？">
        <p>
          育てられています。指宿市は薩摩半島の南部にあり、
          三方を海に囲まれた温暖な土地です。
          山川園芸は指宿市山川でライチをはじめとする熱帯果樹を栽培しています。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>指宿市山川という土地</h2>
        <p>
          指宿市は鹿児島県の薩摩半島南部にある市です。
          そのなかでも山川は、半島のいちばん南にあたる地域にあります。
        </p>
        <p>
          三方を海に囲まれているため、一年をとおして海からの風が通ります。
          海が近い土地は気温の変化がゆるやかになりやすく、
          冬の冷え込みも内陸ほど厳しくなりません。
        </p>
        <p>
          熱帯・亜熱帯の果樹にとって、冬をどう越えるかは大きな課題です。
          温暖な気候であることが、南国の果物を育てるうえでの前提になります。
        </p>

        <h2>指宿で育つ熱帯果樹</h2>
        <p>
          山川園芸では、ライチのほかにもさまざまな熱帯性の果樹を育てています。
          苗木のお取り扱いもあります。
        </p>
        <p>
          時期によって扱っているものが変わるため、
          そのときどきの様子は
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            公式Instagram（{siteConfig.instagram.handle}）
          </a>
          でご覧いただけます。
        </p>

        <h2>指宿のライチはどこで買える？</h2>
        <p>
          山川園芸のオンラインショップから、産地直送でお送りしています。
          収穫できる期間が短いため、販売の時期は限られます。
        </p>
        <p>
          このほか、南さつま市のPICO様の青果コーナーでも
          お取り扱いいただいています（取り扱い状況は時期によって変わります）。
        </p>

        <h2>農園の場所</h2>
        <p>
          {siteConfig.address.full}。
          鹿児島市内から南へ、指宿市の中心部をさらに越えた先にあります。
        </p>
        <p>
          直売・見学をご希望の方は、事前にお電話でご連絡ください。
          地図と連絡先は
          <Link href="/access">農園情報・アクセス</Link>
          に掲載しています。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/kagoshima">
              鹿児島のライチと産地の特徴を読む
            </Link>
          </li>
          <li>
            <Link href="/about">山川園芸について読む</Link>
          </li>
          <li>
            <Link href="/access">農園の場所とアクセスを見る</Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
