/**
 * ライチ完全ガイド（/lychee 配下）のページ登録簿
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * ガイド配下の全ページの metadata・見出し・内部リンク・パンくず・
 * Article構造化データ・sitemap を、この1箇所から生成する。
 * 本文だけを各ページの page.tsx に置き、それ以外はここで一元管理する。
 *
 * ページを1つ足すときは
 *   1. この配列に1件追加する
 *   2. src/app/lychee/<slug>/page.tsx を作る
 * これだけで、一覧・関連リンク・パンくず・sitemap に自動で載る。
 *
 * ─────────────────────────────────────────────
 * 検索意図の重複を作らない
 * ─────────────────────────────────────────────
 * 1キーワード＝1ページの薄い量産はしない。
 * 同じ検索意図のキーワードは1ページに統合する。
 * 例）「ライチ 栄養」「ライチ カロリー」「ライチ ビタミンC」「ライチ 葉酸」
 *     はすべて /lychee/nutrition の1ページで受ける。
 * 新しいページを足す前に、必ず既存ページの intent 欄を確認すること。
 */

export type GuidePage = {
  /** URLの末尾。ピラーページ（/lychee）は "" */
  slug: string;
  /** 一覧・パンくず・内部リンクに使う短い名前 */
  navLabel: string;
  /** 一覧に添える一文 */
  navDescription: string;

  /** <title>。サイト名は layout のテンプレートで自動的に付く */
  title: string;
  /** meta description。検索意図への答えを先に書く */
  description: string;
  /** ページのH1（1ページ1つ） */
  h1: string;
  /** H1直下のリード文 */
  lead: string;

  /**
   * このページが受ける検索意図（内部管理用・画面には出さない）。
   * 新規ページを作る前にここを見て、重複していないか確認する。
   */
  intent: string;
  /** 狙うキーワード（metadata の keywords に使う） */
  keywords: string[];

  /** 公開日 "YYYY-MM-DD" */
  publishedAt: string;
  /** 最終更新日。sitemap の lastModified に使う（実際に直した日を入れる） */
  updatedAt: string;
  /**
   * 山川園芸が内容を確認した日。
   * 確認が取れていないうちは null のままにする。
   * null のあいだ「山川園芸確認済み」の表示は出ない。
   * ※ 確認していない記事を、生産者が執筆・監修したように見せないこと。
   */
  reviewedAt: string | null;

  /** ページ上部の写真。未提供なら src を null にする */
  hero: { src: string | null; alt: string; slot: string };

  /** 関連ページ（ガイド内の slug）。クラスターの結びつきを作る */
  related: string[];
};

/** ガイドのトップ（ピラーページ） */
export const GUIDE_ROOT = "/lychee";

/** slug からパスを組み立てる */
export function guidePath(slug: string): string {
  return slug ? `${GUIDE_ROOT}/${slug}` : GUIDE_ROOT;
}

export const guidePages: GuidePage[] = [
  /* ══════════════ ピラーページ ══════════════ */
  {
    slug: "",
    navLabel: "ライチ完全ガイド",
    navDescription: "ライチとは何か。旬・栄養・食べ方・保存までまとめて。",
    title: "ライチとは？旬・栄養・食べ方・保存方法まで生産農家が解説",
    description:
      "ライチは中国南部原産の果物で、国内では初夏から夏に収穫されます。旬・栄養・食べ方・皮のむき方・保存方法を、鹿児島県指宿市でライチを育てる山川園芸がまとめました。",
    h1: "ライチとは？旬・栄養・食べ方を分かりやすく解説",
    lead: "ライチを初めて食べる方に向けて、知っておきたいことをひととおりまとめました。詳しく知りたい項目は、それぞれのページへ進めます。",
    intent: "「ライチ」で調べる人の総合ハブ。個別の疑問は各詳細ページへ渡す",
    keywords: ["ライチ", "ライチとは", "ライチ 果物", "ライチ 旬 栄養 食べ方"],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-on-tree.jpg",
      alt: "鹿児島県指宿市の山川園芸で木になっているライチの実",
      slot: "lychee/lychee-on-tree.jpg",
    },
    related: ["nutrition", "how-to-eat", "season", "fresh"],
  },

  /* ══════════════ 1位: ライチ 栄養 ══════════════ */
  {
    slug: "nutrition",
    navLabel: "ライチの栄養",
    navDescription: "カロリー・ビタミンC・葉酸・カリウムを公的データで。",
    title: "ライチの栄養は？カロリー・ビタミンC・葉酸などを解説",
    description:
      "ライチ（生）は可食部100gあたり61kcal、ビタミンC 36mg、葉酸100µg、カリウム170mgです。文部科学省の食品成分データベースをもとに、含まれる栄養素を分かりやすく紹介します。",
    h1: "ライチの栄養は？含まれる栄養素を分かりやすく解説",
    lead: "文部科学省の日本食品標準成分表をもとに、ライチ（生）に含まれる栄養素を表にまとめました。",
    intent:
      "ライチの栄養素・カロリー・糖質・ビタミンC・葉酸・カリウムを知りたい（栄養系はすべてこのページに集約）",
    keywords: [
      "ライチ 栄養",
      "ライチ カロリー",
      "ライチ ビタミンC",
      "ライチ 葉酸",
      "ライチ カリウム",
      "ライチ 糖質",
      "ライチ 栄養素",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-closeup.jpg",
      alt: "生ライチの果皮のアップ",
      slot: "lychee/lychee-closeup.jpg",
    },
    related: ["how-to-eat", "season", "storage", "fresh"],
  },

  /* ══════════════ 2位: ライチ 食べ方 ══════════════ */
  {
    slug: "how-to-eat",
    navLabel: "ライチの食べ方",
    navDescription: "皮のむき方、種の取り方、どこまで食べられるか。",
    title: "ライチの食べ方｜皮のむき方・種の取り方を解説",
    description:
      "ライチは皮をむいて中の白い果肉を食べます。包丁は要りません。洗う・皮をむく・果肉を食べる・種を取り除くという4つの手順を、生ライチと冷凍ライチに分けて解説します。",
    h1: "ライチの食べ方｜皮のむき方と種の取り方",
    lead: "包丁もお皿も要りません。手でむいて、そのまま食べられます。",
    intent:
      "ライチの食べ方・皮のむき方・種の扱い・どこを食べるのかを知りたい",
    keywords: [
      "ライチ 食べ方",
      "ライチ 皮 むき方",
      "ライチ むき方",
      "ライチ 種",
      "ライチ 皮",
      "生ライチ 食べ方",
      "ライチ どこまで食べる",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-in-hand.jpg",
      alt: "手に持った生ライチ一粒",
      slot: "lychee/lychee-in-hand.jpg",
    },
    related: ["storage", "taste", "nutrition", "recipes"],
  },

  /* ══════════════ 4位: ライチ 旬 ══════════════ */
  {
    slug: "season",
    navLabel: "ライチの旬",
    navDescription: "国産ライチの時期と、旬が短い理由。",
    title: "ライチの旬はいつ？国産・生ライチの時期を解説",
    description:
      "国産ライチの収穫期は初夏から夏にかけて。産地や品種によって6月下旬から8月ごろまで幅があります。輸入ライチとの違い、旬が短い理由、山川園芸のお届け時期をまとめました。",
    h1: "ライチの旬はいつ？国産・生ライチの時期",
    lead: "国内で穫れる生のライチは、1年のうちごく短い期間しか出回りません。",
    intent: "ライチの旬・時期・収穫時期がいつなのかを知りたい",
    keywords: [
      "ライチ 旬",
      "ライチ 時期",
      "ライチ 旬 いつ",
      "生ライチ 旬",
      "国産ライチ 旬",
      "ライチ 収穫時期",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/farm/lychee-trees.jpg",
      alt: "指宿の農園で実をつけたライチの木",
      slot: "farm/lychee-trees.jpg",
    },
    related: ["domestic", "fresh", "kagoshima", "nutrition"],
  },

  /* ══════════════ 5位: ライチ 保存方法 ══════════════ */
  {
    slug: "storage",
    navLabel: "ライチの保存方法",
    navDescription: "冷蔵・冷凍の保存の仕方と、日持ちの目安。",
    title: "ライチの保存方法｜冷蔵・冷凍と日持ちの目安",
    description:
      "ライチは冷蔵庫で保存し、数日から1週間ほどを目安に食べきります。乾燥すると果皮の色が変わりやすいため袋に入れて保存を。冷凍保存の仕方と、皮が茶色くなったときの考え方も解説します。",
    h1: "ライチの保存方法｜冷蔵・冷凍と日持ち",
    lead: "届いたらまず冷蔵庫へ。乾燥を防ぐことが、いちばんのコツです。",
    intent: "ライチの保存方法・日持ち・冷蔵冷凍の可否を知りたい",
    keywords: [
      "ライチ 保存方法",
      "ライチ 保存",
      "ライチ 日持ち",
      "ライチ 冷蔵",
      "ライチ 冷凍",
      "生ライチ 保存方法",
      "ライチ 長持ち",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/guide/lychee-packing.jpg",
      alt: "ジッパー付きの袋に入れて保存している生ライチ",
      slot: "guide/lychee-packing.jpg",
    },
    related: ["how-to-eat", "fresh", "how-to-choose", "recipes"],
  },

  /* ══════════════ 6位: 生ライチ ══════════════ */
  {
    slug: "fresh",
    navLabel: "生ライチとは",
    navDescription: "冷凍しか知らない方へ。生のライチという果物の話。",
    title: "生ライチとは？味・旬・冷凍との違いを解説",
    description:
      "生ライチは、収穫した実を凍らせずにそのまま届ける状態のライチです。日本で流通しているライチの多くは冷凍のため、生の実に出会える期間はごく短くなります。味・旬・買い方をまとめました。",
    h1: "生ライチとは？冷凍しか食べたことがない方へ",
    lead: "スーパーで見かけるライチの多くは冷凍のものです。生のライチは、そもそも別の状態の果物だと思っていただいてかまいません。",
    intent: "生ライチとは何か、冷凍と何が違うのか、どこで買えるのかを知りたい",
    keywords: [
      "生ライチ",
      "生ライチとは",
      "生ライチ 味",
      "生ライチ 旬",
      "生ライチ 通販",
      "生ライチ 販売",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/products/lychee-tray.jpg",
      alt: "収穫した生ライチをトレイに並べたところ",
      slot: "products/lychee-tray.jpg",
    },
    related: ["fresh-vs-frozen", "taste", "season", "domestic"],
  },

  /* ══════════════ 生と冷凍の違い ══════════════ */
  {
    slug: "fresh-vs-frozen",
    navLabel: "生ライチと冷凍ライチの違い",
    navDescription: "どちらが向いているか、比較表で。",
    title: "生ライチと冷凍ライチの違い｜香り・食感・日持ちを比較",
    description:
      "生ライチと冷凍ライチは、香り・食感・出回る時期・日持ちが異なります。どちらが優れているという話ではなく、それぞれの向き不向きを比較表で整理しました。",
    h1: "生ライチと冷凍ライチの違い",
    lead: "どちらが良い悪いではなく、別のおいしさがあります。選ぶときの参考にしてください。",
    intent: "生と冷凍のどちらを買うか迷っている・違いを比較したい",
    keywords: [
      "生ライチ 冷凍 違い",
      "ライチ 生 冷凍",
      "冷凍ライチ 食べ方",
      "ライチ 冷凍 生 比較",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-closeup.jpg",
      alt: "生ライチの果皮のアップ",
      slot: "lychee/lychee-closeup.jpg",
    },
    related: ["fresh", "storage", "taste", "how-to-eat"],
  },

  /* ══════════════ 7位: 国産ライチ ══════════════ */
  {
    slug: "domestic",
    navLabel: "国産ライチ",
    navDescription: "どこで作られているのか。輸入との違い。",
    title: "国産ライチとは？産地・旬・輸入との違いを解説",
    description:
      "国産ライチは、鹿児島・宮崎・沖縄など温暖な地域で栽培されています。輸入ライチの多くが冷凍で流通するのに対し、国産は生のまま産地から届くのが特徴です。産地と時期をまとめました。",
    h1: "国産ライチとは？産地と旬、輸入ライチとの違い",
    lead: "国内で育つライチは、栽培できる地域が限られています。だから生の実は市場に出る量が少なく、産地から直接届く形が向いています。",
    intent: "国産ライチの産地・流通時期・輸入との違い・買える場所を知りたい",
    keywords: [
      "国産ライチ",
      "国産 生ライチ",
      "国産ライチ 産地",
      "国産ライチ 旬",
      "国産ライチ 通販",
      "ライチ 産地",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/farm/lychee-trees.jpg",
      alt: "鹿児島県指宿市のハウスで育つライチの木",
      slot: "farm/lychee-trees.jpg",
    },
    related: ["kagoshima", "season", "fresh", "ibusuki"],
  },

  /* ══════════════ 9位: 鹿児島のライチ ══════════════ */
  {
    slug: "kagoshima",
    navLabel: "鹿児島のライチ",
    navDescription: "鹿児島で熱帯果樹が育つ理由と、山川園芸のこと。",
    title: "鹿児島のライチ｜産地の特徴と生ライチが買える農園",
    description:
      "鹿児島県は国内でライチを栽培している数少ない地域のひとつです。薩摩半島最南端の指宿市山川でライチを育てる山川園芸が、鹿児島のライチと産地直送での買い方を紹介します。",
    h1: "鹿児島のライチ｜産地の特徴と、生ライチの買い方",
    lead: "鹿児島県指宿市山川。薩摩半島のいちばん南で、山川園芸はライチを育てています。",
    intent: "鹿児島産のライチについて知りたい・鹿児島の生ライチを買いたい",
    keywords: [
      "鹿児島 ライチ",
      "鹿児島 生ライチ",
      "鹿児島 ライチ 通販",
      "鹿児島 フルーツ 通販",
      "鹿児島 熱帯果樹",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-on-tree.jpg",
      alt: "鹿児島県指宿市の山川園芸で色づいたライチの実",
      slot: "lychee/lychee-on-tree.jpg",
    },
    related: ["ibusuki", "domestic", "fresh", "season"],
  },

  /* ══════════════ 10位: 指宿とライチ ══════════════ */
  {
    slug: "ibusuki",
    navLabel: "指宿とライチ・熱帯果樹",
    navDescription: "薩摩半島最南端という土地と、南国の果樹。",
    title: "指宿のライチ｜薩摩半島最南端で育つ熱帯果樹",
    description:
      "指宿市は薩摩半島の南端にあり、三方を海に囲まれた温暖な土地です。山川園芸は指宿市山川新生町でライチをはじめとする熱帯果樹を育てています。土地と果樹の関係を紹介します。",
    h1: "指宿とライチ｜薩摩半島の南端で育つ熱帯果樹",
    lead: "鹿児島県指宿市山川新生町101。三方を海に囲まれた、風の通る土地です。",
    intent: "指宿のライチ・指宿のフルーツ・指宿の熱帯果樹について知りたい",
    keywords: [
      "指宿 ライチ",
      "指宿 生ライチ",
      "指宿 フルーツ",
      "指宿 熱帯果樹",
      "鹿児島 指宿 ライチ",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/farm/lychee-trees.jpg",
      alt: "指宿市山川の農園で育つライチの木",
      slot: "farm/lychee-trees.jpg",
    },
    related: ["kagoshima", "domestic", "season", "fresh"],
  },

  /* ══════════════ ライチの選び方 ══════════════ */
  {
    slug: "how-to-choose",
    navLabel: "ライチの選び方",
    navDescription: "皮の色や張りから、新鮮さを見分ける。",
    title: "ライチの選び方｜新鮮なライチの見分け方",
    description:
      "ライチは皮に張りがあり、重みを感じるものを選びます。果皮の色は時間とともに変わるため、茶色みだけで判断しないのがポイントです。見分け方と、買ったあとの扱い方をまとめました。",
    h1: "ライチの選び方｜新鮮なライチの見分け方",
    lead: "見るところは多くありません。皮の張りと、手に持ったときの重さです。",
    intent: "おいしいライチ・新鮮なライチの見分け方を知りたい",
    keywords: [
      "ライチ 選び方",
      "おいしいライチ 見分け方",
      "ライチ 新鮮",
      "ライチ 皮 色",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/products/lychee-tray.jpg",
      alt: "トレイに並べた収穫したての生ライチ",
      slot: "products/lychee-tray.jpg",
    },
    related: ["storage", "taste", "how-to-eat", "fresh"],
  },

  /* ══════════════ ライチの味 ══════════════ */
  {
    slug: "taste",
    navLabel: "ライチはどんな味？",
    navDescription: "甘み・酸味・香り・食感を、はじめての方へ。",
    title: "ライチはどんな味？甘さ・香り・食感を解説",
    description:
      "ライチは甘みと控えめな酸味があり、華やかな香りが特徴です。果肉は白く半透明で、みずみずしい食感。生と冷凍で感じ方が変わる点もあわせて説明します。",
    h1: "ライチはどんな味？甘さ・香り・食感",
    lead: "食べたことのない果物の味は、言葉だけでは伝わりにくいものです。できるだけ具体的に書きました。",
    intent: "ライチがどんな味・食感なのかを、食べる前に知りたい",
    keywords: ["ライチ 味", "ライチ どんな味", "ライチ 食感", "生ライチ 味"],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-closeup.jpg",
      alt: "生ライチの果皮のアップ",
      slot: "lychee/lychee-closeup.jpg",
    },
    related: ["fresh", "how-to-eat", "fresh-vs-frozen", "how-to-choose"],
  },

  /* ══════════════ ギフト ══════════════ */
  {
    slug: "gift",
    navLabel: "ライチをギフトに",
    navDescription: "夏の贈り物に選ぶときの、確かめておきたいこと。",
    title: "ライチをギフトに｜贈り物に選ぶときのポイント",
    description:
      "生ライチは食べたことのある方が少なく、旬の短い果物です。夏の贈り物に選ぶときに確かめておきたいこと、山川園芸で対応できること・できないことを正直にまとめました。",
    h1: "ライチをギフトに｜贈る前に確かめておきたいこと",
    lead: "珍しい果物だからこそ、贈る前に知っておいていただきたいことがあります。",
    intent: "ライチを贈り物・お中元・プレゼントに贈りたい",
    keywords: [
      "ライチ ギフト",
      "ライチ 贈り物",
      "ライチ お中元",
      "ライチ プレゼント",
      "国産ライチ ギフト",
      "生ライチ ギフト",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/products/lychee-tray.jpg",
      alt: "贈り物としてトレイに並べた生ライチ",
      slot: "products/lychee-tray.jpg",
    },
    related: ["fresh", "storage", "season", "how-to-eat"],
  },

  /* ══════════════ 楽しみ方・レシピ ══════════════ */
  {
    slug: "recipes",
    navLabel: "ライチの楽しみ方",
    navDescription: "そのまま、凍らせて、デザートに。",
    title: "ライチの楽しみ方｜冷やす・凍らせる・デザートに",
    description:
      "ライチはよく冷やしてそのまま食べるのがいちばんです。皮つきのまま凍らせる方法、食べきれないときの使い方、デザートやドリンクへの取り入れ方を紹介します。",
    h1: "ライチの楽しみ方｜冷やす・凍らせる・デザートに",
    lead: "むずかしい調理は要りません。まずは冷やして、そのまま。",
    intent: "ライチをどう食べるか・アレンジ方法・食べきれないときの使い道",
    keywords: [
      "ライチ 食べ方 アレンジ",
      "ライチ デザート",
      "冷凍ライチ 食べ方",
      "ライチ レシピ",
    ],
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    reviewedAt: null,
    hero: {
      src: "/images/lychee/lychee-in-hand.jpg",
      alt: "手に持った生ライチ一粒",
      slot: "lychee/lychee-in-hand.jpg",
    },
    related: ["how-to-eat", "storage", "taste", "fresh"],
  },
];

/* ================================================================
   参照ヘルパー
================================================================ */

/** ピラーページ以外（詳細ページ） */
export const guideChildren = guidePages.filter((page) => page.slug !== "");

/** slug からページを引く */
export function getGuidePage(slug: string): GuidePage | undefined {
  return guidePages.find((page) => page.slug === slug);
}

/** 関連ページを解決する（存在しない slug は落とす） */
export function getRelatedGuidePages(page: GuidePage): GuidePage[] {
  return page.related
    .map((slug) => getGuidePage(slug))
    .filter((item): item is GuidePage => Boolean(item));
}

/**
 * ピラーページのパンくず。
 * 詳細ページは ホーム > ライチ完全ガイド > 各ページ の3階層になる。
 */
export function guideCrumbs(page: GuidePage) {
  const root = { name: "ライチ完全ガイド", path: GUIDE_ROOT };
  if (!page.slug) return [root];
  return [root, { name: page.navLabel, path: guidePath(page.slug) }];
}
