import Link from "next/link";
import FaqList from "@/components/ui/FaqList";
import JsonLd from "@/components/ui/JsonLd";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { answeredFaqs, faqCategories, getFaqsByCategory } from "@/data/faq";
import { siteConfig } from "@/data/siteConfig";
import { faqJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

/**
 * よくある質問（/faq）
 *
 * 回答が未確認の質問（answer が null）は、質問だけを出して
 * 問い合わせ導線を案内する。構造化データには含めない。
 * data/faq.ts の answer に文章を入れれば、表示と構造化データの両方に反映される。
 */

export const metadata = buildMetadata({
  title: "よくある質問｜ライチの旬・食べ方・配送について",
  description:
    "ライチの旬や食べ方、保存方法、ご注文・配送についてよくいただく質問をまとめました。鹿児島・指宿の山川園芸のオンラインショップに関するご案内です。",
  path: "/faq",
  keywords: ["ライチ よくある質問", "ライチ 旬", "ライチ 保存", "ライチ 通販 送料"],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={faqJsonLd(
          answeredFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        )}
      />

      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="ライチのこと、ご注文のこと。お問い合わせの多いものをまとめました。"
        crumbs={[{ name: "よくある質問", path: "/faq" }]}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
        {/* 目次 */}
        <Reveal>
          <nav aria-label="質問の分類">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {faqCategories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#faq-${category.id}`}
                    className="text-[0.87rem] text-moss underline underline-offset-8 transition-colors hover:text-forest"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <div className="mt-14 space-y-16 md:space-y-20">
          {faqCategories.map((category) => {
            const items = getFaqsByCategory(category.id);
            if (items.length === 0) return null;

            return (
              <Reveal
                key={category.id}
                as="section"
                aria-labelledby={`faq-${category.id}`}
              >
                <h2
                  id={`faq-${category.id}`}
                  className="font-mincho text-[1.3rem] leading-snug text-forest md:text-[1.55rem]"
                >
                  {category.name}
                </h2>
                <span
                  aria-hidden="true"
                  className="reveal-line mt-6 block h-px w-14 bg-leaf/60"
                />
                <div className="mt-8">
                  <FaqList items={items} />
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* 問い合わせ */}
        <Reveal className="mt-20 border border-ink/12 bg-paper-warm px-6 py-9 text-center md:px-10">
          <h2 className="font-mincho text-[1.2rem] text-forest">
            解決しないことがありましたら
          </h2>
          <p className="mx-auto mt-5 max-w-[32rem] text-[0.9rem] leading-[2] text-moss">
            お電話またはお問い合わせフォームより、お気軽にご連絡ください。
            収穫の時期は農作業中で電話に出られないことがありますので、
            その際はフォームをご利用ください。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
            >
              お問い合わせ
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center justify-center border border-ink/20 px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
            >
              {siteConfig.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </>
  );
}
