import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { contactConfig, siteConfig } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";

/**
 * プライバシーポリシー（/privacy）
 *
 * [TODO] アクセス解析（Google Analytics 等）を導入した場合は、
 * 「アクセス解析ツールについて」の項目を追加すること。
 * 現在は解析ツールを入れていない前提の記載になっている。
 */

export const metadata = buildMetadata({
  title: "プライバシーポリシー",
  description:
    "山川園芸のプライバシーポリシーです。お客様の個人情報の取り扱いについてご説明します。",
  path: "/privacy",
});

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "個人情報の取得について",
    body: [
      "当園は、商品のご注文・お問い合わせにあたり、お名前、ご住所、電話番号、メールアドレスなどの個人情報をお預かりする場合があります。取得にあたっては、あらかじめ利用目的をお伝えし、適法かつ公正な手段によって行います。",
    ],
  },
  {
    title: "個人情報の利用目的",
    body: [
      "お預かりした個人情報は、以下の目的で利用します。",
      "・ご注文いただいた商品の発送および代金の請求のため",
      "・ご注文内容の確認、お届けに関するご連絡のため",
      "・お問い合わせへの回答のため",
      "・商品や販売時期に関するご案内のため",
    ],
  },
  {
    title: "個人情報の第三者提供",
    body: [
      "当園は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく個人情報を第三者に提供することはありません。",
      "ただし、商品の配送のために必要な範囲で、配送業者にお届け先の情報を提供します。また、お支払いの処理のために、決済代行サービスへ必要な情報を提供する場合があります。",
    ],
  },
  {
    title: "個人情報の管理",
    body: [
      "お預かりした個人情報は、紛失・破損・改ざん・漏えいなどが起こらないよう、必要かつ適切な管理を行います。利用目的を終えた個人情報は、速やかに廃棄いたします。",
    ],
  },
  {
    title: "個人情報の開示・訂正・削除",
    body: [
      "ご本人から、ご自身の個人情報の開示・訂正・利用停止・削除を求められた場合は、ご本人であることを確認したうえで、速やかに対応いたします。下記の連絡先までご連絡ください。",
    ],
  },
  {
    title: "クッキー（Cookie）について",
    body: [
      "本サイトでは、カートに入れた商品の内容を、お客様のブラウザ内（ローカルストレージ）に保存しています。これはお客様の端末内にのみ保存されるもので、当園がその内容を取得することはありません。",
      "ブラウザの設定で保存を無効にした場合、カートの内容が保持されないことがあります。",
    ],
  },
  {
    title: "外部サービスについて",
    body: [
      "本サイトには、Googleマップ、Instagram、外部のオンラインショップへのリンクや埋め込みが含まれています。これらのサービスにおける個人情報の取り扱いについては、各サービスの定めるところによります。",
    ],
  },
  {
    title: "本ポリシーの変更",
    body: [
      "当園は、必要に応じて本ポリシーの内容を見直し、変更することがあります。変更後の内容は、本ページに掲載した時点から適用されます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy policy"
        title="プライバシーポリシー"
        crumbs={[{ name: "プライバシーポリシー", path: "/privacy" }]}
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-[0.93rem] leading-[2.05] text-ink/85">
            {siteConfig.name}（以下「当園」）は、お客様の個人情報を大切に取り扱います。
            本ポリシーは、当園が取得する個人情報の取り扱いについて定めるものです。
          </p>
        </Reveal>

        <div className="prose-farm mt-12 text-[0.93rem] text-ink/85">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section>
            <h2>お問い合わせ窓口</h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
            </p>
            <p>
              {siteConfig.name}（代表 {siteConfig.owner}）
              <br />
              {siteConfig.address.full}
              <br />
              電話：{siteConfig.phone}（{siteConfig.hoursSummary}）
              {contactConfig.email && (
                <>
                  <br />
                  メール：{contactConfig.email}
                </>
              )}
            </p>
          </section>
        </div>

        <Reveal className="mt-14">
          <Link
            href="/legal"
            className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            特定商取引法に基づく表記
          </Link>
        </Reveal>
      </div>
    </>
  );
}
