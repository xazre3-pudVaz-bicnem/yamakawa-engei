import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 border text-center font-medium leading-tight transition-colors duration-300";

const variants: Record<Variant, string> = {
  // 購入導線。サイト内で赤を使うのはここだけに絞る。
  primary:
    "border-lychee bg-lychee text-white hover:border-lychee-deep hover:bg-lychee-deep",
  secondary:
    "border-forest bg-forest text-paper hover:border-forest-deep hover:bg-forest-deep",
  ghost:
    "border-ink/20 bg-transparent text-ink hover:border-forest hover:text-forest",
  onDark:
    "border-cream/40 bg-transparent text-cream hover:border-cream hover:bg-cream hover:text-forest-deep",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3 text-sm tracking-[0.08em]",
  lg: "px-9 py-4 text-[0.95rem] tracking-[0.1em]",
};

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** 外部サイトへのリンク（新しいタブで開く） */
  external?: boolean;
};

export default function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
