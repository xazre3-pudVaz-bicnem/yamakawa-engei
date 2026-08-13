import Link from "next/link";
import Logo from "./Logo";
import { footerNavigation, siteConfig } from "@/data/siteConfig";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain bg-forest-deep text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* ---- 農園情報（ローカルSEOの要） ---- */}
          <div>
            <Logo tone="dark" />
            <p className="mt-6 max-w-[26rem] text-[0.88rem] leading-[2] text-cream/75">
              鹿児島県指宿市山川で、ライチをはじめとする熱帯果樹を育てています。
              旬のあいだだけ、農園から直接お届けします。
            </p>

            <address className="mt-8 space-y-2.5 text-[0.85rem] not-italic leading-[1.9] text-cream/75">
              <p>{siteConfig.name}（代表 {siteConfig.owner}）</p>
              <p>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-cream"
                >
                  {siteConfig.address.full}
                </a>
              </p>
              <p>
                <a
                  href={siteConfig.phoneHref}
                  className="underline underline-offset-4 hover:text-cream"
                >
                  {siteConfig.phone}
                </a>
                <span className="ml-2 text-cream/55">
                  {siteConfig.hoursSummary}
                </span>
              </p>
              <p className="text-cream/55">{siteConfig.busySeasonNote}</p>
            </address>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.82rem]">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-lychee-soft"
              >
                Instagram {siteConfig.instagram.handle}
              </a>
              <Link
                href="/shop"
                className="underline underline-offset-4 hover:text-lychee-soft"
              >
                オンラインショップ
              </Link>
            </div>
          </div>

          {/* ---- サイト内リンク ---- */}
          <nav aria-label="フッターメニュー">
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {footerNavigation.map((group) => (
                <div key={group.title}>
                  <h2 className="font-mincho text-[0.9rem] tracking-[0.1em] text-cream/90">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[0.82rem] leading-relaxed text-cream/65 underline-offset-4 transition-colors hover:text-cream hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/12 pt-8 text-[0.75rem] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {siteConfig.name}</p>
          <p className="font-serif-en tracking-[0.18em]">
            Yamakawa Engei, Ibusuki, Kagoshima
          </p>
        </div>
      </div>

      {/* スマホ下部の固定バーに隠れないよう、余白を確保する */}
      <div aria-hidden="true" className="h-20 lg:hidden" />
    </footer>
  );
}
