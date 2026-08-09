import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { getGuidePage, guidePath } from "@/data/lycheeGuide";
import { nutrients } from "@/data/nutrition";

/**
 * ライチを知る（TOPページ）
 *
 * ライチ完全ガイドへの入口。
 * カードを大量に並べたつくりにはせず、
 * 大きな写真とテキストのリストでブランドの見え方を保っている。
 *
 * 並べるページは data/lycheeGuide.ts から引いているので、
 * ラベルや説明文を直すときはそちらを直せばここにも反映される。
 */

/** TOPに出す入口。読まれる順に並べている */
const FEATURED = ["nutrition", "how-to-eat", "season", "storage", "fresh"];

function nutrient(name: string): string {
  const row = nutrients.find((item) => item.name === name);
  return row ? `${row.value}${row.unit}` : "—";
}

export default function LycheeGuideSection() {
  const pages = FEATURED.map((slug) => getGuidePage(slug)).filter(
    (page): page is NonNullable<typeof page> => Boolean(page),
  );

  return (
    <section className="bg-paper-warm">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.25fr] md:gap-16">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
              Lychee guide
            </p>
            <h2 className="mt-5 font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
              ライチを知る
            </h2>
            <span
              aria-hidden="true"
              className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
            />
            <p className="mt-7 max-w-[26rem] text-[0.93rem] leading-[2.05] text-moss">
              旬はいつなのか、どんな栄養があるのか、どうやって食べるのか。
              ライチを育てている農園として、
              調べたいことに答えるページをまとめました。
            </p>

            <div className="mt-9 hidden md:block">
              <Photo
                src="/images/lychee/lychee-closeup.jpg"
                alt="鹿児島県指宿市の山川園芸で育てた生ライチの果皮"
                aspect="aspect-[4/5]"
                sizes="30vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="border-t border-ink/12">
              {pages.map((page) => (
                <li key={page.slug} className="border-b border-ink/12">
                  <Link
                    href={guidePath(page.slug)}
                    className="group flex items-baseline justify-between gap-6 py-7"
                  >
                    <span>
                      <span className="font-mincho text-[1.1rem] leading-[1.7] text-forest underline-offset-8 group-hover:underline">
                        {page.navLabel}
                      </span>
                      <span className="mt-2 block text-[0.88rem] leading-[1.9] text-moss">
                        {page.navDescription}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lychee-deep"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ガイドの中身が具体的に伝わるよう、数字をひとつだけ添える */}
            <p className="mt-8 text-[0.85rem] leading-[1.95] text-moss">
              たとえばライチ（生）は可食部100gあたり
              {nutrient("エネルギー")}、ビタミンC {nutrient("ビタミンC")}、
              葉酸 {nutrient("葉酸")}。
              文部科学省の食品成分データベースにもとづく数値を掲載しています。
            </p>

            <div className="mt-9">
              <Link
                href="/lychee"
                className="inline-flex items-center justify-center border border-forest bg-forest px-8 py-3.5 text-[0.9rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
              >
                ライチ完全ガイドを見る
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
