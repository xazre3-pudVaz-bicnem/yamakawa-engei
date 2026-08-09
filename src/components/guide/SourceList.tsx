import { formatDate } from "@/lib/utils";

/**
 * 参考資料・出典
 *
 * 栄養・統計・研究などを扱うページの最後に置く。
 * 出典のない数字はページに載せないこと。
 * 外部リンクは新しいタブで開き、rel を付ける。
 */
export default function SourceList({
  items,
  checkedAt,
}: {
  items: Array<{ label: string; publisher: string; url: string }>;
  /** 実際に一次資料を確認した日 */
  checkedAt?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="references"
      className="border-t border-ink/12 pt-9"
    >
      <h2
        id="references"
        className="font-mincho text-[1.05rem] tracking-[0.04em] text-forest"
      >
        参考資料
      </h2>
      <ul className="mt-5 space-y-3 text-[0.85rem] leading-[1.9] text-moss">
        {items.map((item) => (
          <li key={item.url} className="flex gap-3">
            <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-ink/25" />
            <span>
              {item.publisher}「
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lychee-deep underline underline-offset-4 hover:text-lychee"
              >
                {item.label}
              </a>
              」
            </span>
          </li>
        ))}
      </ul>
      {checkedAt && (
        <p className="mt-4 text-[0.78rem] text-moss">
          数値は{formatDate(checkedAt)}時点で上記の資料を確認したものです。
        </p>
      )}
    </section>
  );
}
