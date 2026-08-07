import { cn } from "@/lib/utils";

/**
 * ロゴ
 *
 * [TODO] 正式なロゴ画像が未提供のため、明朝体の組みロゴで代用している。
 * ロゴデータを受け取ったら public/images/brand/ に置き、
 * ここを next/image に置き換えること。
 */
export default function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span className={cn("flex items-baseline gap-2.5", className)}>
      <span
        className={cn(
          "font-mincho text-[1.1rem] tracking-[0.16em] md:text-[1.2rem]",
          tone === "dark" ? "text-cream" : "text-forest",
        )}
      >
        山川園芸
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "font-serif-en text-[0.6rem] uppercase tracking-[0.28em]",
          tone === "dark" ? "text-cream/55" : "text-moss",
        )}
      >
        Ibusuki
      </span>
    </span>
  );
}
