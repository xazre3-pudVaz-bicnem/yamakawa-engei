import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * 楽しみ方
 *
 * 商品の実際の特性から離れた提案はしない。
 * 「そのまま」「冷やして」「凍らせて」は公式ショップの商品説明にもある食べ方。
 * レシピや加工品の提案は、実際に確認できてから追加すること。
 *
 * 写真は `photo` を持つ項目だけが大きな組みになる。
 * 写真がない項目は文章だけで見せるので、空の写真枠が並ぶことがない。
 * 該当の写真が撮れたら photo を足すだけで大きな組みに変わる。
 */

type Way = {
  index: string;
  title: string;
  body: string;
  photo?: { src: string; alt: string };
};

const WAYS: Way[] = [
  {
    index: "01",
    title: "冷やして、そのまま",
    body: "いちばんおすすめの食べ方です。冷蔵庫でよく冷やして、皮をむいてそのまま。手が汚れるくらいの果汁が出ます。",
    photo: {
      src: "/images/products/lychee-tray.jpg",
      alt: "トレイに並べた冷たい生ライチ",
    },
  },
  {
    index: "02",
    title: "凍らせて",
    body: "皮つきのまま冷凍しておけば、しばらく楽しめます。半解凍でシャーベットのように食べるのも夏らしいものです。",
    // [TODO] 凍らせたライチの写真が撮れたら photo を追加
  },
  {
    index: "03",
    title: "デザートやスムージーに",
    body: "皮と種を取ってミキサーへ。スムージーやデザートの材料としても使えます。",
    // [TODO] デザートに使った写真が撮れたら photo を追加
  },
  {
    index: "04",
    title: "家族で、囲んで",
    body: "包丁もお皿も要りません。テーブルに出して、みんなでむきながら食べる。それがいちばん楽しい食べ方かもしれません。",
    photo: {
      src: "/images/lychee/lychee-in-hand.jpg",
      alt: "手に持ったライチ一粒",
    },
  },
];

const withPhoto = WAYS.filter((way) => way.photo);
const textOnly = WAYS.filter((way) => !way.photo);

export default function EnjoySection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="font-serif-en text-[0.7rem] uppercase tracking-[0.34em] text-lychee-deep">
          How to enjoy
        </p>
        <h2 className="mt-5 max-w-[22ch] font-mincho text-[1.7rem] leading-[1.55] text-forest md:text-[2.15rem]">
          冷やして、凍らせて。
          <br />
          いちばんおいしい食べ方を。
        </h2>
        <span
          aria-hidden="true"
          className="reveal-line mt-8 block h-px w-16 bg-leaf/60"
        />
      </Reveal>

      {/* 写真のある楽しみ方は、写真と文章が交互に現れる組みで見せる */}
      <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
        {withPhoto.map((way, index) => (
          <Reveal
            key={way.index}
            className={
              index % 2 === 0
                ? "grid gap-7 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-14"
                : "grid gap-7 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-14"
            }
          >
            <div className={index % 2 === 0 ? "" : "md:order-2"}>
              <Photo
                src={way.photo?.src ?? null}
                alt={way.photo?.alt ?? ""}
                aspect={index % 2 === 0 ? "aspect-[3/2]" : "aspect-[4/3]"}
                sizes="(min-width: 768px) 55vw, 100vw"
              />
            </div>

            <div className={index % 2 === 0 ? "" : "md:order-1"}>
              <p className="font-serif-en text-[0.72rem] tracking-[0.3em] text-lychee-deep">
                {way.index}
              </p>
              <h3 className="mt-4 font-mincho text-[1.3rem] leading-[1.6] text-forest md:text-[1.5rem]">
                {way.title}
              </h3>
              <p className="mt-5 max-w-[30rem] text-[0.93rem] leading-[2.05] text-ink/80">
                {way.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 写真のない楽しみ方は、文章だけで静かに置く */}
      {textOnly.length > 0 && (
        <Reveal className="mt-16 grid gap-x-14 gap-y-10 border-t border-ink/12 pt-12 md:mt-20 md:grid-cols-2">
          {textOnly.map((way) => (
            <div key={way.index}>
              <p className="font-serif-en text-[0.72rem] tracking-[0.3em] text-lychee-deep">
                {way.index}
              </p>
              <h3 className="mt-3 font-mincho text-[1.2rem] leading-[1.6] text-forest md:text-[1.35rem]">
                {way.title}
              </h3>
              <p className="mt-4 max-w-[28rem] text-[0.93rem] leading-[2.05] text-ink/80">
                {way.body}
              </p>
            </div>
          ))}
        </Reveal>
      )}
    </section>
  );
}
