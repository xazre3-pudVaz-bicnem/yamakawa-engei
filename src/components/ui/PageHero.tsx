import Image from "next/image";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

type PageHeroProps = {
  /** ページ見出し（h1） */
  title: React.ReactNode;
  /** 見出しの上の英字 */
  eyebrow?: string;
  /** 見出しの下の説明 */
  lead?: React.ReactNode;
  crumbs: Crumb[];
  /** 背景写真。未提供なら枠だけが表示される */
  photo?: { src: string | null; alt: string; slot: string };
};

/**
 * 下層ページの共通ヘッダー。
 * 写真がある場合は全面写真、ない場合は深緑の面で見出しを見せる。
 * どちらの場合も文字は必ず読める明度差を保つ。
 */
export default function PageHero({
  title,
  eyebrow,
  lead,
  crumbs,
  photo,
}: PageHeroProps) {
  return (
    <header className="relative isolate overflow-hidden bg-forest-deep">
      {photo?.src ? (
        <>
          {/* 背景写真は Photo コンポーネントを介さず直接置く。
              Photo は position:relative の枠を作るため、
              inset-0 で敷き詰める用途には使えない。 */}
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            priority
            quality={82}
            className="object-cover opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-forest-deep/85 via-forest-deep/45 to-forest-deep/60"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="grain absolute inset-0 bg-linear-to-br from-forest via-forest-deep to-forest-deep"
        />
      )}

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36">
        <Breadcrumbs items={crumbs} tone="dark" />
        {eyebrow && (
          <p className="mt-8 font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-soft">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-[28ch] font-mincho text-[1.75rem] leading-[1.5] tracking-[0.04em] text-cream md:text-[2.6rem]">
          {title}
        </h1>
        {lead && (
          <div className="mt-7 max-w-[42rem] text-[0.95rem] leading-[2.05] text-cream/85">
            {lead}
          </div>
        )}
      </div>
    </header>
  );
}
