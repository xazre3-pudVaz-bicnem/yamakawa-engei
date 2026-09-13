import type { ReactNode } from "react";

/**
 * ページ内の目次
 *
 * 長いページで「どこに何が書いてあるか」を最初に示すためのもの。
 * 検索から来た人が、自分の知りたい見出しへ直接飛べるようにする。
 *
 * 見出しとリンク先は、ページ側で組み立てた同じ配列から作る。
 * 手で二重に書くと、見出しを直したときに目次だけ古くなる。
 */
export default function FruitToc({
  items,
}: {
  items: Array<{ id: string; label: string }>;
}) {
  if (items.length < 3) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="border border-ink/12 bg-paper-warm px-6 py-7 md:px-8"
    >
      <p
        id="toc-heading"
        className="font-serif-en text-[0.66rem] uppercase tracking-[0.28em] text-lychee-deep"
      >
        Contents
      </p>
      <ol className="mt-5 grid gap-x-8 gap-y-3 text-[0.9rem] sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <span
              aria-hidden="true"
              className="tnum font-serif-en text-[0.8rem] leading-[1.9] text-leaf"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${item.id}`}
              className="leading-[1.9] text-ink/85 underline-offset-4 hover:text-forest hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * 目次から飛べる見出し付きのまとまり。
 * id を付けた section と、統一した見出しの体裁をまとめて用意する。
 */
export function FruitSection({
  id,
  heading,
  children,
  className,
}: {
  id: string;
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-28 ${className ?? ""}`}
    >
      <h2
        id={`${id}-heading`}
        className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]"
      >
        {heading}
      </h2>
      <span
        aria-hidden="true"
        className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
      />
      {children}
    </section>
  );
}
