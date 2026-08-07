import Link from "next/link";
import FaqList from "@/components/ui/FaqList";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { featuredFaqs } from "@/data/faq";
import { faqJsonLd } from "@/lib/jsonld";

/**
 * よくある質問（TOP）
 *
 * 表示しているのは回答が確定しているものだけ。
 * 構造化データも同じ配列から生成するので、画面と食い違わない。
 */
export default function FaqSection() {
  if (featuredFaqs.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-24 md:px-8 md:py-32">
      <JsonLd
        data={faqJsonLd(
          featuredFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        )}
      />

      <Reveal>
        <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
          FAQ
        </p>
        <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.05rem]">
          よくある質問
        </h2>
        <span
          aria-hidden="true"
          className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
        />
      </Reveal>

      <Reveal className="mt-12">
        <FaqList items={featuredFaqs} />
      </Reveal>

      <Reveal className="mt-10">
        <Link
          href="/faq"
          className="text-[0.88rem] text-lychee-deep underline underline-offset-8 hover:text-lychee"
        >
          質問をすべて見る
        </Link>
      </Reveal>
    </section>
  );
}
