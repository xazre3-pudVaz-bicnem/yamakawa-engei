import Link from "next/link";
import AnswerBox from "@/components/guide/AnswerBox";
import GuideLayout from "@/components/guide/GuideLayout";
import { getGuidePage } from "@/data/lycheeGuide";
import { salesStatus, shippingConfig, siteConfig } from "@/data/siteConfig";
import { buildGuideMetadata } from "@/lib/metadata";

/**
 * ライチをギフトに（/lychee/gift）
 *
 * ─────────────────────────────────────────────
 * 絶対に守ること
 * ─────────────────────────────────────────────
 * 未対応のサービスを「対応している」と書かない。
 * のし・ギフト包装・メッセージカードは siteConfig の giftWrapping で
 * 管理していて、現在は available: false（非対応）。
 * 本文にも直接書かず、必ず設定値を参照すること。
 * 対応を始めたら設定を変えるだけで、このページの記載も切り替わる。
 */

const page = getGuidePage("gift")!;

export const metadata = buildGuideMetadata(page);

export default function GiftPage() {
  const { giftWrapping, packagingNote } = siteConfig;

  return (
    <GuideLayout page={page}>
      <AnswerBox question="ライチは贈り物にできますか？">
        <p>
          できます。お届け先をご指定いただければ、産地から直接お送りできます。
          食べたことのある方が少なく、旬が短い果物なので、
          夏のご挨拶や季節の贈り物として選ばれています。
        </p>
        <p className="mt-2">
          ただし山川園芸では
          {giftWrapping.available
            ? "のし・ギフト包装に対応しています。"
            : "のし・ギフト包装・メッセージカードには対応していません。"}
          贈る前に確かめておきたいことを、下にまとめました。
        </p>
      </AnswerBox>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>ライチが贈り物に向いている理由</h2>

        <h3>食べたことのある人が少ない</h3>
        <p>
          冷凍のライチを口にしたことはあっても、
          生のライチは初めてという方がほとんどです。
          「これが生なんだ」という驚きが、そのまま贈り物の印象になります。
        </p>

        <h3>旬が短く、その時期にしか贈れない</h3>
        <p>
          手に入る期間が限られているものは、それだけで特別な贈り物になります。
          季節のご挨拶としても意味が伝わりやすい果物です。
        </p>

        <h3>皮をむくところから楽しめる</h3>
        <p>
          包丁もお皿も要りません。
          手でむいてそのまま食べられるので、
          ご家族でテーブルを囲む時間そのものが贈り物になります。
        </p>

        <h2>贈る前に確かめておきたいこと</h2>
        <ul className="space-y-3">
          {[
            "生鮮食品です。お届け先に長期のご不在がないかご確認ください。",
            "中心に大きめの種があります。小さなお子様やご高齢の方がいるご家庭では、ひとことお伝えいただくと安心です。",
            "届いたら冷蔵庫で保存していただく必要があります。",
            "収穫の状況によってお届け時期が前後することがあります。",
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

        <h2>山川園芸で対応できること・できないこと</h2>
      </div>

      {/* 対応可否は設定値から生成する。本文に直接書かない */}
      <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/12 text-[0.92rem]">
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">お届け先の指定</dt>
          <dd className="leading-[1.95]">
            ご注文時にお届け先をご指定いただけます。
          </dd>
        </div>
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">包装</dt>
          <dd className="leading-[1.95]">{packagingNote}</dd>
        </div>
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">のし・ギフト包装</dt>
          <dd className="leading-[1.95]">{giftWrapping.note}</dd>
        </div>
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">お届け日の指定</dt>
          <dd className="leading-[1.95]">
            {shippingConfig.canSpecifyDeliveryDate === null
              ? "ご希望のある方は、ご注文前にご相談ください。収穫の状況に合わせて発送しているため、ご希望に添えない場合もあります。"
              : shippingConfig.canSpecifyDeliveryDate
                ? "お届け日をご指定いただけます。"
                : "収穫の状況に合わせて発送するため、お届け日のご指定は承っておりません。"}
          </dd>
        </div>
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">お届け地域</dt>
          <dd className="leading-[1.95]">
            {shippingConfig.deliverableArea ?? "お問い合わせください。"}
          </dd>
        </div>
        <div className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
          <dt className="w-40 shrink-0 text-moss">お届けできる時期</dt>
          <dd className="leading-[1.95]">{salesStatus.seasonLabel}まで</dd>
        </div>
      </dl>

      <div className="prose-farm mt-12 text-[0.95rem] text-ink/85">
        <h2>こんな方への贈り物に</h2>
        <ul className="space-y-3">
          {[
            "夏のご挨拶・季節の贈り物をお探しの方に",
            "珍しいフルーツギフトを探している方に",
            "ご家族やお子さまと囲む食卓への贈り物に",
            "毎年同じものを贈っていて、違うものにしたい方に",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-3.5 h-px w-4 shrink-0 bg-leaf/70"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2>贈る方に伝えておくとよいこと</h2>
        <p>
          生のライチは、食べ方を知らない方も多い果物です。
          「皮をむいて食べる」「種があるので取り除く」という2点だけ
          お伝えいただけると、受け取った方が迷いません。
        </p>
        <p>
          <Link href="/lychee/how-to-eat">ライチの食べ方のページ</Link>
          を一緒にお知らせいただくのもおすすめです。
        </p>

        <h2>次に読む</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/lychee/fresh">生ライチとはどんな果物かを読む</Link>
          </li>
          <li>
            <Link href="/lychee/storage">
              届いたあとの保存方法を見る
            </Link>
          </li>
          <li>
            <Link href="/shipping">配送・送料についてを見る</Link>
          </li>
        </ul>
      </div>
    </GuideLayout>
  );
}
