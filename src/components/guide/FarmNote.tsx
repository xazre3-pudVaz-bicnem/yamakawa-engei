import { siteConfig } from "@/data/siteConfig";

/**
 * 農園からの一次情報
 *
 * ─────────────────────────────────────────────
 * これがこのサイトの最大の武器
 * ─────────────────────────────────────────────
 * 一般的なライチの解説は、どのサイトにも書いてあります。
 * 差がつくのは「実際に育てている人しか書けないこと」です。
 *
 * 山川園芸から次のような情報をいただけたら、
 * 該当するガイドページにこのコンポーネントで差し込んでください。
 *   ・今年の出来、収穫の時期
 *   ・品種ごとの味や大きさの違い
 *   ・木の様子、花が咲く時期、実がふくらむ様子
 *   ・選果や箱詰めでの見極め方
 *   ・おすすめの食べ方、保存のコツ
 *   ・お客様からよく聞かれること
 *
 * ─────────────────────────────────────────────
 * 守ること
 * ─────────────────────────────────────────────
 * 実際に伺っていない内容を、生産者の言葉として書かないこと。
 * このコンポーネントは「農園から伺った話」として表示されるため、
 * 推測や一般論をここに入れると読者を欺くことになります。
 */
export default function FarmNote({
  title = "山川園芸から",
  /** 生産者ご本人の言葉として掲載する場合のみ true */
  fromProducer = false,
  children,
}: {
  title?: string;
  fromProducer?: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside className="grain border border-leaf/30 bg-leaf-pale/30 px-6 py-7 md:px-8">
      <p className="font-serif-en text-[0.66rem] uppercase tracking-[0.28em] text-lychee-deep">
        From the farm
      </p>
      <h2 className="mt-3 font-mincho text-[1.08rem] leading-[1.7] text-forest">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[0.93rem] leading-[2] text-ink/85">
        {children}
      </div>
      <p className="mt-5 text-[0.78rem] leading-[1.8] text-moss">
        {fromProducer
          ? `${siteConfig.name}／${siteConfig.owner}`
          : `${siteConfig.name}（${siteConfig.address.full}）`}
      </p>
    </aside>
  );
}
