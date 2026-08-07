import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** 見出し（日本語） */
  title: React.ReactNode;
  /** 見出しの上に置く小さな英字 */
  eyebrow?: string;
  /** 見出しの下の説明文 */
  lead?: React.ReactNode;
  /** 見出しレベル。ページ内の階層に合わせて変える */
  as?: "h2" | "h3";
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  title,
  eyebrow,
  lead,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        align === "center" && "flex flex-col items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "font-serif-en text-[0.7rem] uppercase tracking-[0.34em]",
            dark ? "text-lychee-soft" : "text-lychee-deep",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "font-mincho text-[1.6rem] leading-[1.55] tracking-[0.04em] md:text-[2.1rem]",
          eyebrow && "mt-4",
          dark ? "text-cream" : "text-forest",
        )}
      >
        {title}
      </Tag>
      <span
        aria-hidden="true"
        className={cn(
          "reveal-line mt-6 block h-px w-16",
          align === "center" && "reveal-line-center",
          dark ? "bg-cream/40" : "bg-leaf/60",
        )}
      />
      {lead && (
        <div
          className={cn(
            "mt-6 max-w-[38rem] text-[0.95rem] leading-[2.05]",
            dark ? "text-cream/80" : "text-moss",
          )}
        >
          {lead}
        </div>
      )}
    </div>
  );
}
