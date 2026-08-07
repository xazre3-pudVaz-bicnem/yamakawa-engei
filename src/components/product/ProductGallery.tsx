"use client";

import { useState } from "react";
import Photo from "@/components/ui/Photo";
import type { ProductImage } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * 商品写真
 *
 * 1枚目を大きく見せ、下にサムネイルを並べる。
 * 写真が未提供のあいだも、どの写真を何枚入れるのかが分かるように
 * すべての枠を表示する。
 */
export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (images.length === 0) {
    return (
      <Photo
        src={null}
        alt={productName}
        slot="products/main.jpg"
        label="商品写真"
        aspect="aspect-[4/5]"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    );
  }

  return (
    <div>
      <Photo
        src={current.src}
        alt={current.alt}
        slot={current.slot}
        label={current.alt}
        aspect="aspect-[4/5]"
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
        quality={82}
      />

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <li key={image.slot}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${image.alt}を表示`}
                aria-current={index === active}
                className={cn(
                  "block w-full border transition-colors",
                  index === active
                    ? "border-forest"
                    : "border-transparent hover:border-ink/25",
                )}
              >
                <Photo
                  src={image.src}
                  alt=""
                  aspect="aspect-square"
                  sizes="120px"
                  tone={index % 2 === 0 ? "cream" : "leaf"}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
