import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { contactConfig, siteConfig } from "@/data/siteConfig";
import { buildMetadata } from "@/lib/metadata";

/**
 * お問い合わせ（/contact）
 *
 * ─────────────────────────────────────────────
 * 現在の状態
 * ─────────────────────────────────────────────
 * 公開できるメールアドレス・フォームの送信先が未確認のため、
 * 「確実に届く連絡手段」だけを案内している。
 * 送信されても誰にも届かないフォームは置かない。
 *
 * 自社フォームを設置するとき
 *   1. data/siteConfig.ts の contactConfig.email に受信先を入れる
 *   2. contactConfig.formEndpoint に送信先（例: "/api/contact"）を入れる
 *   3. app/api/contact/route.ts を作り、Resend / SendGrid 等でメールを送る
 *      （APIキーは環境変数から読むこと）
 */

export const metadata = buildMetadata({
  title: "お問い合わせ",
  description:
    "山川園芸へのお問い合わせ先です。ライチのご注文・配送・贈り物についてのご相談は、お電話または公式オンラインショップの問い合わせフォームよりご連絡ください。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="お問い合わせ"
        lead="ご注文・配送・贈り物についてのご相談を承ります。お気軽にご連絡ください。"
        crumbs={[{ name: "お問い合わせ", path: "/contact" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]">
            ご連絡方法
          </h2>
          <span
            aria-hidden="true"
            className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
          />
        </Reveal>

        <div className="mt-12 space-y-6">
          {/* 電話 */}
          <Reveal className="border border-ink/12 bg-paper-warm px-6 py-7 md:px-8">
            <p className="font-serif-en text-[0.68rem] uppercase tracking-[0.3em] text-lychee-deep">
              Tel
            </p>
            <h3 className="mt-3 font-mincho text-[1.15rem] text-forest">
              お電話
            </h3>
            <p className="mt-4 text-[0.9rem] leading-[1.95] text-ink/80">
              いちばん早くご返答できます。
              収穫の時期は農作業中で出られないことがありますので、
              その際は時間をおいておかけ直しください。
            </p>
            <p className="mt-5">
              <a
                href={siteConfig.phoneHref}
                className="tnum inline-flex items-center font-mincho text-[1.5rem] text-forest underline underline-offset-8 hover:text-lychee-deep"
              >
                {siteConfig.phone}
              </a>
            </p>
            <p className="mt-2 text-[0.83rem] text-moss">
              受付時間 {siteConfig.hoursSummary}／{siteConfig.busySeasonNote}
            </p>
          </Reveal>

          {/* 公式ショップの問い合わせフォーム */}
          <Reveal className="border border-ink/12 px-6 py-7 md:px-8">
            <p className="font-serif-en text-[0.68rem] uppercase tracking-[0.3em] text-lychee-deep">
              Form
            </p>
            <h3 className="mt-3 font-mincho text-[1.15rem] text-forest">
              お問い合わせフォーム
            </h3>
            <p className="mt-4 text-[0.9rem] leading-[1.95] text-ink/80">
              お時間を気にせずご連絡いただけます。
              ご注文後のお問い合わせも、こちらから承ります。
            </p>
            <p className="mt-6">
              <a
                href={contactConfig.shopContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
              >
                フォームを開く
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </p>
          </Reveal>

          {/* Instagram */}
          <Reveal className="border border-ink/12 px-6 py-7 md:px-8">
            <p className="font-serif-en text-[0.68rem] uppercase tracking-[0.3em] text-lychee-deep">
              Instagram
            </p>
            <h3 className="mt-3 font-mincho text-[1.15rem] text-forest">
              Instagramのメッセージ
            </h3>
            <p className="mt-4 text-[0.9rem] leading-[1.95] text-ink/80">
              農園の日々もこちらでお伝えしています。
              今年の収穫の状況や販売の開始も、まずInstagramでお知らせします。
            </p>
            <p className="mt-6">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.9rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
              >
                {siteConfig.instagram.handle}
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </p>
          </Reveal>

          {/* メール（設定されている場合のみ表示） */}
          {contactConfig.email && (
            <Reveal className="border border-ink/12 px-6 py-7 md:px-8">
              <p className="font-serif-en text-[0.68rem] uppercase tracking-[0.3em] text-lychee-deep">
                Mail
              </p>
              <h3 className="mt-3 font-mincho text-[1.15rem] text-forest">
                メール
              </h3>
              <p className="mt-5">
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="text-[0.95rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
                >
                  {contactConfig.email}
                </a>
              </p>
            </Reveal>
          )}
        </div>

        {/* ご連絡の前に */}
        <Reveal className="mt-16">
          <h2 className="font-mincho text-[1.25rem] text-forest">
            ご連絡の前に
          </h2>
          <p className="mt-5 text-[0.9rem] leading-[2] text-moss">
            旬の時期・食べ方・保存方法・配送についてのご質問は、
            下記のページでもご案内しています。
          </p>
          <ul className="mt-7 divide-y divide-ink/12 border-y border-ink/12">
            {[
              { href: "/faq", label: "よくある質問", desc: "お問い合わせの多いものをまとめています" },
              { href: "/shipping", label: "配送・送料について", desc: "発送の時期と送料のご案内" },
              { href: "/guide", label: "お買い物ガイド", desc: "ご注文からお届けまでの流れ" },
              { href: "/how-to-eat", label: "食べ方・保存方法", desc: "皮のむき方から保存まで" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span>
                    <span className="text-[0.95rem] text-forest underline-offset-8 group-hover:underline">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[0.83rem] text-moss">
                      {item.desc}
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-lychee-deep">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}
