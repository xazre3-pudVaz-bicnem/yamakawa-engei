import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ProductRow from "@/components/product/ProductRow";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/ui/JsonLd";
import {
  getActiveCategories,
  getProductsByCategory,
  visibleProducts,
} from "@/data/products";
import { currentSales, salesStatus, shippingConfig } from "@/data/siteConfig";
import { productListJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "オンラインショップ｜生ライチの通販・産地直送",
  description:
    "鹿児島県指宿市山川の山川園芸から、旬の生ライチを産地直送でお届けします。国産ライチのお取り寄せはこちらから。販売状況・内容量・価格をご案内しています。",
  path: "/shop",
  keywords: [
    "生ライチ 通販",
    "国産ライチ 通販",
    "ライチ お取り寄せ",
    "ライチ 産地直送",
    "鹿児島 フルーツ 通販",
  ],
});

export default function ShopPage() {
  const categories = getActiveCategories();

  return (
    <>
      <JsonLd data={productListJsonLd()} />

      <PageHero
        eyebrow="Online shop"
        title="農園から、産地直送で。"
        lead="鹿児島県指宿市山川の農園で育てた果実を、旬のあいだだけお届けします。"
        crumbs={[{ name: "オンラインショップ", path: "/shop" }]}
      />

      {/* ---- 今の販売状況 ---- */}
      <section className="border-b border-ink/10 bg-paper-warm">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-12">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center border border-lychee/40 bg-lychee-soft/45 px-3.5 py-1 text-[0.72rem] tracking-[0.14em] text-lychee-deep">
              {currentSales.label}
            </span>
            <p className="text-[0.9rem] text-ink/85">{currentSales.heading}</p>
            <p className="text-[0.8rem] text-moss">
              旬は{salesStatus.seasonLabel}
            </p>
          </div>
          <p className="mt-4 max-w-[46rem] text-[0.88rem] leading-[1.95] text-moss">
            {currentSales.body}
          </p>
        </div>
      </section>

      {/* ---- 商品 ---- */}
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {visibleProducts.length === 0 ? (
          <p className="py-16 text-center text-[0.95rem] text-moss">
            ただいまお取り扱いのある商品はありません。
          </p>
        ) : (
          categories.map((category) => {
            const items = getProductsByCategory(category.id);
            return (
              <section
                key={category.id}
                className="mb-24 last:mb-0 md:mb-32"
                aria-labelledby={`category-${category.id}`}
              >
                <Reveal>
                  <h2
                    id={`category-${category.id}`}
                    className="font-mincho text-[1.4rem] leading-snug text-forest md:text-[1.7rem]"
                  >
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-4 max-w-[38rem] text-[0.9rem] leading-[2] text-moss">
                      {category.description}
                    </p>
                  )}
                  <span
                    aria-hidden="true"
                    className="reveal-line mt-7 block h-px w-16 bg-leaf/60"
                  />
                </Reveal>

                <div className="mt-14 space-y-20 md:space-y-28">
                  {items.map((product, index) => (
                    <Reveal key={product.slug}>
                      <ProductRow
                        product={product}
                        reverse={index % 2 === 1}
                        index={index + 1}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* ---- 買う前に知っておきたいこと ---- */}
        <Reveal className="mt-24 border-t border-ink/12 pt-14 md:mt-32">
          <h2 className="font-mincho text-[1.25rem] text-forest">
            ご購入の前に
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
            <div>
              <dt className="text-[0.85rem] tracking-[0.06em] text-lychee-deep">
                お届けについて
              </dt>
              <dd className="mt-3 text-[0.88rem] leading-[1.95] text-ink/80">
                {shippingConfig.dispatchLead}
                。{shippingConfig.note}
                <Link
                  href="/shipping"
                  className="mt-2 block text-lychee-deep underline underline-offset-4"
                >
                  配送・送料について
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-[0.85rem] tracking-[0.06em] text-lychee-deep">
                はじめての方へ
              </dt>
              <dd className="mt-3 text-[0.88rem] leading-[1.95] text-ink/80">
                皮のむき方や保存の仕方は、こちらでご案内しています。
                <Link
                  href="/lychee/how-to-eat"
                  className="mt-2 block text-lychee-deep underline underline-offset-4"
                >
                  ライチの食べ方・皮のむき方
                </Link>
                <Link
                  href="/lychee/storage"
                  className="mt-1 block text-lychee-deep underline underline-offset-4"
                >
                  ライチの保存方法・日持ち
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-[0.85rem] tracking-[0.06em] text-lychee-deep">
                お支払いについて
              </dt>
              <dd className="mt-3 text-[0.88rem] leading-[1.95] text-ink/80">
                お支払い方法やご注文の流れをまとめています。
                <Link
                  href="/guide"
                  className="mt-2 block text-lychee-deep underline underline-offset-4"
                >
                  お買い物ガイド
                </Link>
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* 商品 → 解説ページ。ライチを知らない人が判断できる材料を渡す */}
        <Reveal className="mt-16 border-t border-ink/12 pt-12">
          <h2 className="font-mincho text-[1.25rem] leading-snug text-forest md:text-[1.45rem]">
            ライチについて調べる
          </h2>
          <p className="mt-4 max-w-[40rem] text-[0.9rem] leading-[2] text-moss">
            ライチを買うのが初めての方へ。
            旬・栄養・食べ方・保存方法を、育てている農園としてまとめました。
          </p>
          <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {[
              { href: "/lychee", label: "ライチ完全ガイド（目次）" },
              { href: "/lychee/fresh", label: "生ライチとはどんな果物か" },
              { href: "/lychee/nutrition", label: "ライチの栄養・カロリー" },
              { href: "/lychee/season", label: "ライチの旬と収穫時期" },
              { href: "/lychee/gift", label: "ライチをギフトに贈るときは" },
              { href: "/lychee/kagoshima", label: "鹿児島のライチについて" },
            ].map((link) => (
              <li key={link.href} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-3.5 h-px w-4 shrink-0 bg-lychee/60"
                />
                <Link
                  href={link.href}
                  className="text-[0.9rem] leading-[1.9] text-forest underline-offset-4 hover:text-lychee-deep hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}
