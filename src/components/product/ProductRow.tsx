import Link from "next/link";
import Photo from "@/components/ui/Photo";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * 商品の見せ方
 *
 * 同じ大きさのカードを並べるのではなく、写真を大きく取った
 * 見開きのような組みにする。左右を交互に入れ替えて単調さを避ける。
 * 商品が増えても、この1つの組み方で一覧が成立する。
 */
export default function ProductRow({
  product,
  reverse = false,
  index,
}: {
  product: Product;
  reverse?: boolean;
  /** 通し番号（01, 02 …）。表示しない場合は省略 */
  index?: number;
}) {
  const image = product.images[0];
  const price = formatPrice(product.price);

  return (
    <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <Link
        href={`/products/${product.slug}`}
        className={cn("block", reverse && "md:order-2")}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Photo
          src={image?.src ?? null}
          alt={image?.alt ?? product.name}
          slot={image?.slot}
          label={image?.alt}
          aspect="aspect-[4/3] md:aspect-[5/4]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </Link>

      <div className={cn(reverse && "md:order-1")}>
        {index !== undefined && (
          <p className="font-serif-en text-[0.72rem] tracking-[0.3em] text-lychee-deep">
            {String(index).padStart(2, "0")}
          </p>
        )}

        <h3 className="mt-4 font-mincho text-[1.45rem] leading-[1.5] text-forest md:text-[1.7rem]">
          <Link
            href={`/products/${product.slug}`}
            className="underline-offset-8 hover:underline"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-5 text-[0.93rem] leading-[2.05] text-ink/85">
          {product.lead}
        </p>

        <dl className="mt-7 space-y-2 border-t border-ink/12 pt-6 text-[0.85rem]">
          {product.volume && (
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-moss">内容量</dt>
              <dd>
                {product.volume}
                {product.countGuide ? `（${product.countGuide}）` : ""}
              </dd>
            </div>
          )}
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-moss">産地</dt>
            <dd>{product.origin}</dd>
          </div>
          <div className="flex items-baseline gap-4">
            <dt className="w-20 shrink-0 text-moss">価格</dt>
            <dd className="tnum font-mincho text-[1.25rem] text-ink">
              {price ?? "準備中"}
              {price && (
                <span className="ml-2 text-[0.75rem] text-moss">
                  税込／送料別
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <StatusBadge status={product.availability} />
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center border border-forest bg-forest px-7 py-3 text-[0.85rem] tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-forest-deep"
          >
            商品を見る
          </Link>
        </div>
      </div>
    </article>
  );
}
