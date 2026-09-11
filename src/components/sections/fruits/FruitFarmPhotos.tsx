import Photo from "@/components/ui/Photo";
import type { FruitPhoto } from "@/data/fruits";

/**
 * 農園の写真3枚
 *
 * 1枚目を大きく、2・3枚目を右に縦に重ねる、雑誌のような組み。
 * 同じ大きさの写真を等間隔に並べるグリッドにはしない。
 *
 * スマホ … 1枚目を全幅、2・3枚目を横に2つ並べる
 * PC     … 1枚目が2行ぶんの高さを持ち、その高さに2・3枚目が収まる
 *
 * 写真はLINEで届いた縦長のもの（960×1280前後）。
 * 画面いっぱいに引き伸ばすと粗くなるため、最大幅を抑えている。
 */
export default function FruitFarmPhotos({
  photos,
}: {
  photos: [FruitPhoto, FruitPhoto, FruitPhoto];
}) {
  const [main, ...rest] = photos;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.35fr_1fr] md:grid-rows-2 md:gap-5">
      <figure className="col-span-2 md:col-span-1 md:row-span-2">
        <Photo
          src={main.src}
          alt={main.alt}
          aspect="aspect-[4/5]"
          sizes="(min-width: 1152px) 620px, (min-width: 768px) 55vw, 100vw"
          tone="leaf"
        />
        <figcaption className="mt-3 text-[0.8rem] leading-[1.8] text-moss">
          {main.caption}
        </figcaption>
      </figure>

      {rest.map((photo) => (
        <figure key={photo.src} className="flex min-h-0 flex-col">
          <Photo
            src={photo.src}
            alt={photo.alt}
            aspect="aspect-[3/4] md:aspect-auto"
            className="md:min-h-0 md:flex-1"
            sizes="(min-width: 1152px) 460px, (min-width: 768px) 40vw, 50vw"
            tone="leaf"
          />
          <figcaption className="mt-3 text-[0.8rem] leading-[1.8] text-moss">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
