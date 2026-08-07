import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoProps = {
  /**
   * 写真のパス（/public からの相対）。
   * null のあいだは、どんな写真を入れる枠なのかを示す
   * プレースホルダーが表示される。写真を用意したら
   *   1. public/images/ 配下に置く
   *   2. 呼び出し元の src に "/images/..." を渡す
   * だけで next/image による最適化表示に切り替わる。
   */
  src?: string | null;
  /** 写真の内容をそのまま日本語で書く（音声読み上げ・SEO用） */
  alt?: string;
  /** 写真がないときに表示する被写体名。例: "収穫したライチ" */
  label?: string;
  /**
   * 入れるべきファイルのパス。例: "hero/hero-lychee.jpg"
   * プレースホルダーに小さく表示し、写真の差し替え先が一目で分かるようにする。
   */
  slot?: string;
  /** アスペクト比クラス。例: "aspect-[4/5]" */
  aspect?: string;
  /** next/image の sizes 属性。実写真に差し替えたときの配信サイズを決める */
  sizes?: string;
  /** ファーストビューの写真だけ true */
  priority?: boolean;
  /** 画質。next.config.ts の images.qualities に列挙した値のみ */
  quality?: 75 | 82;
  /**
   * 切り抜きの基準位置。
   * 縦位置の写真を横長の枠に入れるときなど、
   * 残したい部分に寄せるために使う。
   */
  focus?: "center" | "top" | "bottom" | "left" | "right";
  /** プレースホルダーのトーン */
  tone?: "cream" | "leaf" | "forest";
  className?: string;
  /** 画像に重ねる要素（ヒーローのコピーなど） */
  children?: React.ReactNode;
};

/**
 * 写真枠
 *
 * 農園・商品の実写真がまだ揃っていないため、写真のない箇所は
 * ブランドカラーの抽象的な枠で代替する。
 * 架空の写真やAI生成画像は使わない。
 */
export default function Photo({
  src,
  alt = "",
  label,
  slot,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  quality = 75,
  focus = "center",
  tone = "cream",
  className,
  children,
}: PhotoProps) {
  if (src) {
    const objectPosition = {
      center: "object-center",
      top: "object-top",
      bottom: "object-bottom",
      left: "object-left",
      right: "object-right",
    }[focus];

    return (
      <div className={cn("relative overflow-hidden", aspect, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn("parallax-media object-cover", objectPosition)}
        />
        {children}
      </div>
    );
  }

  const palette = {
    cream: {
      surface: "bg-linear-to-br from-cream via-paper-warm to-sand/70",
      stroke: "text-leaf/45",
      accent: "text-lychee/35",
      text: "text-moss",
    },
    leaf: {
      surface: "bg-linear-to-br from-leaf-pale via-paper-warm to-cream",
      stroke: "text-forest/30",
      accent: "text-lychee/30",
      text: "text-moss",
    },
    forest: {
      surface: "bg-linear-to-br from-forest via-forest-deep to-forest-deep",
      stroke: "text-cream/25",
      accent: "text-lychee-soft/40",
      text: "text-cream/60",
    },
  }[tone];

  return (
    <div
      className={cn(
        "grain relative overflow-hidden",
        aspect,
        palette.surface,
        className,
      )}
    >
      {/* ライチの枝の線画（装飾のため読み上げ対象から外す） */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-1/2 h-[62%] w-auto -translate-x-1/2 -translate-y-1/2"
        fill="none"
      >
        <path
          d="M100 24v58"
          className={palette.stroke}
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M100 60c-16-2-28-12-32-28 18-2 30 8 32 28Z"
          className={palette.stroke}
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M100 76c16-2 28-12 32-28-18-2-30 8-32 28Z"
          className={palette.stroke}
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle
          cx="80"
          cy="112"
          r="24"
          className={palette.accent}
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle
          cx="122"
          cy="132"
          r="18"
          className={palette.accent}
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle
          cx="80"
          cy="112"
          r="2"
          className={palette.accent}
          fill="currentColor"
        />
      </svg>

      {/* 内側の細い枠 */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-4 border",
          tone === "forest" ? "border-cream/12" : "border-ink/8",
        )}
      />

      {/* 何を入れる枠なのかを示す */}
      {(label || slot) && (
        <span
          className={cn(
            "absolute bottom-5 left-5 right-5 flex flex-col gap-1",
            palette.text,
          )}
        >
          {label && (
            <span className="text-[0.7rem] tracking-[0.14em]">{label}</span>
          )}
          {slot && (
            <span className="font-serif-en text-[0.6rem] tracking-[0.12em] opacity-60">
              public/images/{slot}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
