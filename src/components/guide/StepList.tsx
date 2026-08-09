import Photo from "@/components/ui/Photo";

export type Step = {
  title: string;
  body: string;
  /** 手順写真。未提供なら src を null にしておく（枠だけ出る） */
  photo?: { src: string | null; alt: string; slot: string };
};

/**
 * 手順
 *
 * 番号付きの <ol> で組む。検索エンジンにもAI検索にも
 * 「手順である」ことが伝わるよう、見出しではなくリストで表す。
 *
 * 写真が入ると分かりやすさが大きく上がる箇所なので、
 * photo を渡せる形にしてある。src が null のあいだは枠だけが出る。
 */
export default function StepList({
  steps,
  /** 写真の枠を出すか。写真がまだ1枚もないページでは false にする */
  showPhotos = false,
}: {
  steps: Step[];
  showPhotos?: boolean;
}) {
  return (
    <ol className="mt-8 border-t border-ink/12">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="border-b border-ink/12 py-7 md:flex md:gap-8"
        >
          {showPhotos && step.photo && (
            <div className="mb-5 w-full shrink-0 md:mb-0 md:w-56">
              <Photo
                src={step.photo.src}
                alt={step.photo.alt}
                slot={step.photo.slot}
                label={step.photo.alt}
                aspect="aspect-[4/3]"
                sizes="(min-width: 768px) 224px, 100vw"
              />
            </div>
          )}

          <div className="flex flex-1 gap-5">
            <span
              aria-hidden="true"
              className="font-serif-en text-[0.78rem] tracking-[0.24em] text-lychee-deep"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-mincho text-[1.08rem] leading-[1.7] text-forest md:text-[1.2rem]">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.93rem] leading-[2.05] text-ink/85">
                {step.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
