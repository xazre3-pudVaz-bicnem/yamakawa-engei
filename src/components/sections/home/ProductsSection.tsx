import Link from "next/link";
import ProductRow from "@/components/product/ProductRow";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { visibleProducts } from "@/data/products";

/**
 * 商品一覧
 *
 * data/products.ts に商品を追加すれば、そのままここにも並ぶ。
 */
export default function ProductsSection() {
  if (visibleProducts.length === 0) return null;

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Online shop"
          title="農園から直接お届けします"
          lead="旬のあいだだけのお取り扱いです。ご注文はこちらから。"
        />
      </Reveal>

      <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
        {visibleProducts.map((product, index) => (
          <Reveal key={product.slug}>
            <ProductRow
              product={product}
              reverse={index % 2 === 1}
              index={index + 1}
            />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center md:mt-20">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center border border-ink/20 px-9 py-4 text-[0.9rem] tracking-[0.1em] text-ink transition-colors duration-300 hover:border-forest hover:text-forest"
        >
          オンラインショップをすべて見る
        </Link>
      </Reveal>
    </section>
  );
}
