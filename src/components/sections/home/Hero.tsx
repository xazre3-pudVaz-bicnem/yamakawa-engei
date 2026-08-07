import Image from "next/image";
import Link from "next/link";
import { currentSales, salesStatus, siteConfig } from "@/data/siteConfig";

/**
 * ヒーロー
 *
 * カードの中に入れず、画面いっぱいの写真を背景にする。
 *
 * 現在の hero-lychee.jpg は生成画像で、後日、農園で撮影した写真に
 * 差し替える予定（合意済み）。差し替えは下の1行だけでよい。
 * 横位置（16:9前後）の写真がいちばん向いている。
 */
const HERO_PHOTO: string | null = "/images/hero/hero-lychee.jpg";
const HERO_ALT = "たわわに実ったライチ";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden md:min-h-screen">
      {/* ---- 背景 ---- */}
      {HERO_PHOTO ? (
        <>
          <Image
            src={HERO_PHOTO}
            alt={HERO_ALT}
            fill
            sizes="100vw"
            priority
            quality={82}
            className="object-cover object-right"
          />
          {/* 文字を確実に読ませるための覆い。
              左側にコピーを置くため、左と下を濃くしている。 */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-r from-forest-deep/90 via-forest-deep/55 to-forest-deep/15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-forest-deep/80 via-transparent to-forest-deep/35"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="grain absolute inset-0 bg-linear-to-b from-forest via-forest-deep to-[#0d2417]"
          />
          {/* 葉とライチの実の線画。写真が入るまでの間の顔になる */}
          <svg
            aria-hidden="true"
            viewBox="0 0 600 600"
            className="absolute -right-16 top-1/2 h-[70vh] w-auto -translate-y-1/2 opacity-40 md:right-[6%]"
            fill="none"
          >
            <path
              d="M300 60v360"
              stroke="#cfdcd0"
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
            <path
              d="M300 200c-58-6-100-44-114-102 64-8 108 30 114 102Z"
              stroke="#cfdcd0"
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
            <path
              d="M300 262c58-6 100-44 114-102-64-8-108 30-114 102Z"
              stroke="#cfdcd0"
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
            <circle cx="238" cy="392" r="78" stroke="#edd0d3" strokeOpacity="0.45" strokeWidth="1.4" />
            <circle cx="368" cy="452" r="58" stroke="#edd0d3" strokeOpacity="0.35" strokeWidth="1.4" />
            <circle cx="238" cy="392" r="4" fill="#edd0d3" fillOpacity="0.5" />
          </svg>
        </>
      )}

      {/* ---- コピー ---- */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pb-28">
        <p
          className="hero-fade font-serif-en text-[0.7rem] uppercase tracking-[0.36em] text-lychee-soft"
          style={{ "--hero-delay": "0.1s" } as React.CSSProperties}
        >
          Kagoshima ／ Ibusuki ／ Yamakawa
        </p>

        <h1
          className="hero-fade mt-7 font-mincho text-[2.1rem] leading-[1.5] tracking-[0.05em] text-cream sm:text-[2.6rem] md:text-[3.4rem]"
          style={{ "--hero-delay": "0.25s" } as React.CSSProperties}
        >
          指宿から、
          <br />
          旬のライチを。
        </h1>

        <p
          className="hero-fade mt-8 max-w-[34rem] text-[0.95rem] leading-[2.1] text-cream/85 md:text-[1rem]"
          style={{ "--hero-delay": "0.45s" } as React.CSSProperties}
        >
          薩摩半島のいちばん南、鹿児島県指宿市山川。
          <br className="hidden sm:block" />
          海からの風のなかで育った生のライチを、旬のあいだだけ農園からお届けします。
        </p>

        {/* 販売状況と購入導線 */}
        <div
          className="hero-fade mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"
          style={{ "--hero-delay": "0.6s" } as React.CSSProperties}
        >
          <Link
            href={currentSales.ctaHref}
            className="inline-flex items-center justify-center border border-lychee bg-lychee px-9 py-4 text-[0.95rem] tracking-[0.1em] text-white transition-colors duration-300 hover:border-lychee-deep hover:bg-lychee-deep"
          >
            {currentSales.ctaLabel}
          </Link>
          <Link
            href="/lychee"
            className="inline-flex items-center justify-center border border-cream/40 px-9 py-4 text-[0.95rem] tracking-[0.1em] text-cream transition-colors duration-300 hover:bg-cream hover:text-forest-deep"
          >
            生ライチってどんな果物？
          </Link>
        </div>

        <p
          className="hero-fade mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8rem] text-cream/70"
          style={{ "--hero-delay": "0.75s" } as React.CSSProperties}
        >
          <span className="inline-flex items-center border border-lychee-soft/45 px-3 py-1 text-[0.72rem] tracking-[0.12em] text-lychee-soft">
            {currentSales.label}
          </span>
          <span>旬は{salesStatus.seasonLabel}／{siteConfig.origin}</span>
        </p>
      </div>

      {/* スクロールの合図 */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 bg-cream/25 md:block"
      >
        <span className="scroll-cue-bar block h-full w-full bg-cream/70" />
      </div>
    </section>
  );
}
