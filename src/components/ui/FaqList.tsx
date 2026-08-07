import Link from "next/link";
import type { FaqItem } from "@/data/faq";
import { UNCONFIRMED_NOTE } from "@/data/siteConfig";

/**
 * FAQ の表示
 *
 * <details> を使うので JavaScript なしで開閉でき、キーボードでも操作できる。
 * 回答が未確認（answer が null）の質問は、答えを書かずに
 * お問い合わせ導線だけを出す。構造化データからも除外される。
 */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-ink/12">
      {items.map((faq) => (
        <details key={faq.id} className="group border-b border-ink/12">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden="true"
              className="mt-[0.55rem] font-serif-en text-sm text-lychee-deep"
            >
              Q
            </span>
            <span className="flex-1 font-mincho text-[1.02rem] leading-[1.75] text-forest">
              {faq.question}
            </span>
            <span
              aria-hidden="true"
              className="relative mt-3 h-3 w-3 shrink-0 text-leaf"
            >
              <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="flex gap-4 pb-7 pl-0 pr-7">
            <span
              aria-hidden="true"
              className="font-serif-en text-sm text-leaf"
            >
              A
            </span>
            <div className="flex-1 text-[0.92rem] leading-[2] text-ink/85">
              {faq.answer ? (
                <p>{faq.answer}</p>
              ) : (
                <p className="text-moss">
                  こちらは現在確認中です。{UNCONFIRMED_NOTE}
                </p>
              )}
              {faq.link && (
                <p className="mt-3">
                  <Link
                    href={faq.link.href}
                    className="text-[0.85rem] text-lychee-deep underline underline-offset-4 hover:text-lychee"
                  >
                    {faq.link.label}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
