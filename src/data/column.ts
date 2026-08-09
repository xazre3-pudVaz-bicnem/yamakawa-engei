/**
 * コラム（/column）
 *
 * ─────────────────────────────────────────────
 * 記事の追加方法
 * ─────────────────────────────────────────────
 * columns 配列に1件追加するだけで
 *   /column（一覧）
 *   /column/[slug]（記事）
 *   sitemap.xml
 *   Article 構造化データ
 * に反映される。
 *
 * 本文は「ブロックの配列」で書く。Markdownパーサを入れずに
 * 見出し・段落・箇条書き・補足を型安全に扱うための構造。
 *   { type: "h2",   text: "見出し" }
 *   { type: "h3",   text: "小見出し" }
 *   { type: "p",    text: "本文" }
 *   { type: "ul",   items: ["項目1", "項目2"] }
 *   { type: "note", text: "補足・注記" }
 *
 * ─────────────────────────────────────────────
 * 書くときの約束
 * ─────────────────────────────────────────────
 * - 山川園芸の栽培方法・品種・糖度など、確認できていないことは書かない。
 * - 果物一般の話と、山川園芸の話を混ぜない。
 * - 各ページの検索意図が重ならないようにする（下記のすみ分けを守る）。
 *     /lychee      … ライチとは / 生ライチ / 国産ライチ
 *     /how-to-eat  … 食べ方 / 皮のむき方 / 保存方法
 *     /shop        … 通販 / お取り寄せ / 産地直送
 *     /column/*    … それ以外の、より細かい検索意図
 */

export type ColumnBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export type ColumnCategory = "lychee" | "farm" | "gift";

export type ColumnArticle = {
  slug: string;
  title: string;
  /** 一覧・meta description に使う要約（120文字以内が目安） */
  excerpt: string;
  category: ColumnCategory;
  /** 公開日 "YYYY-MM-DD" */
  date: string;
  /** 更新日。未更新なら null */
  updated: string | null;
  /** このページで狙う検索キーワード（内部管理用。画面には出さない） */
  keywords: string[];
  body: ColumnBlock[];
  /** 記事下に置く関連ページ */
  related: Array<{ href: string; label: string }>;
};

export const columnCategoryLabel: Record<ColumnCategory, string> = {
  lychee: "ライチのこと",
  farm: "農園のこと",
  gift: "贈り物のこと",
};

export const columns: ColumnArticle[] = [
  {
    slug: "lychee-season",
    title: "ライチの旬はいつ？国産ライチに出会える、ごく短い季節のこと",
    excerpt:
      "国産の生ライチが穫れるのは1年のうちほんの数週間。産地ごとの旬の時期と、その短さの理由をやさしく解説します。",
    category: "lychee",
    date: "2026-05-20",
    updated: null,
    keywords: ["ライチ 旬", "国産ライチ 時期", "生ライチ いつ"],
    body: [
      {
        type: "p",
        text: "「ライチはいつが食べごろですか」。この時期になると、いちばん多くいただく質問です。答えを先にお伝えすると、国内で育ったライチが穫れるのは初夏から夏にかけて。1年のうち、ほんの数週間だけです。",
      },
      { type: "h2", text: "国産ライチの旬は、産地によって6月下旬から8月ごろ" },
      {
        type: "p",
        text: "ライチはもともと暖かい地域の果物です。日本では、鹿児島・宮崎・沖縄など南のほうの地域で育てられていて、初夏から真夏にかけて実が色づきます。産地や品種、その年の気温や雨の降り方によって、収穫の時期は前後します。",
      },
      {
        type: "p",
        text: "鹿児島県指宿市山川にある山川園芸からお届けできるのは、7月上旬からお盆ごろまでです。",
      },
      {
        type: "p",
        text: "スーパーで一年じゅう見かける冷凍のライチとちがい、生のライチは「穫れたときにだけある」果物です。旬を逃すと、次は来年になります。",
      },
      { type: "h2", text: "どうして旬がこんなに短いのか" },
      {
        type: "p",
        text: "理由はふたつあります。ひとつは、実が熟すタイミングが木ごとにそろっていて、収穫できる期間そのものが短いこと。もうひとつは、収穫したあとの日もちが長くないことです。",
      },
      {
        type: "p",
        text: "ライチは収穫すると果皮の色が変わりやすい果物です。だからこそ、産地から直接、なるべく早くお届けする形が向いています。",
      },
      { type: "h2", text: "旬を逃さないために" },
      {
        type: "ul",
        items: [
          "販売の開始は、公式Instagramとサイトのお知らせでご案内しています",
          "収穫の時期が近づいたら、予約の受付を始めることがあります",
          "その年の天候によって、時期が前後することがあります",
        ],
      },
      {
        type: "note",
        text: "山川園芸のライチは7月上旬からお盆ごろまでのお取り扱いです。今季の販売状況はオンラインショップのページをご覧ください。",
      },
    ],
    related: [
      { href: "/lychee", label: "ライチについて" },
      { href: "/shop", label: "オンラインショップ" },
    ],
  },

  {
    slug: "lychee-as-a-gift",
    title: "ライチを贈り物にするなら。夏の贈答に選ばれる理由と、贈るときの注意",
    excerpt:
      "珍しいフルーツギフトを探している方へ。生ライチが夏の贈り物に向いている理由と、贈る前に確かめておきたいことをまとめました。",
    category: "gift",
    date: "2026-05-27",
    updated: null,
    keywords: ["ライチ ギフト", "珍しい フルーツ ギフト", "夏 贈り物 果物"],
    body: [
      {
        type: "p",
        text: "夏の贈り物にフルーツを選ぶ方は多いものの、桃やメロンはすでに贈られていることも少なくありません。「もらったことがないものを贈りたい」というときに、生のライチという選択肢があります。",
      },
      { type: "h2", text: "生ライチが贈り物に向いている理由" },
      {
        type: "h3",
        text: "食べたことがある人が少ない",
      },
      {
        type: "p",
        text: "冷凍のライチを口にしたことはあっても、生のライチは初めてという方がほとんどです。「これが生なんだ」という驚きが、そのまま贈り物の印象になります。",
      },
      { type: "h3", text: "旬が短く、その時期しか贈れない" },
      {
        type: "p",
        text: "手に入る期間が限られているものは、それだけで特別な贈り物になります。季節の挨拶としても意味が伝わりやすい果物です。",
      },
      { type: "h3", text: "皮をむくところから楽しめる" },
      {
        type: "p",
        text: "包丁もお皿も要りません。手でむいてそのまま食べられるので、ご家族でテーブルを囲む時間そのものが贈り物になります。",
      },
      { type: "h2", text: "贈る前に確かめておきたいこと" },
      {
        type: "ul",
        items: [
          "生鮮食品です。お届け先にご不在が続かないか確認しておくと安心です",
          "種があります。小さなお子様やご高齢の方がいるご家庭では、ひとことお伝えください",
          "冷蔵庫で保存していただく必要があります",
        ],
      },
      {
        type: "note",
        text: "のし・ギフト包装の対応については、お問い合わせよりご確認ください。",
      },
    ],
    related: [
      { href: "/shop", label: "オンラインショップ" },
      { href: "/how-to-eat", label: "食べ方・保存方法" },
    ],
  },

  {
    slug: "ibusuki-tropical-fruit",
    title: "鹿児島・指宿で南国のフルーツが育つということ",
    excerpt:
      "薩摩半島のいちばん南、指宿市山川。海に囲まれたこの土地で熱帯果樹が育つ背景を、地理と気候の面から紹介します。",
    category: "farm",
    date: "2026-06-03",
    updated: null,
    keywords: ["指宿 フルーツ", "鹿児島 南国フルーツ", "熱帯果樹 栽培"],
    body: [
      {
        type: "p",
        text: "ライチやマンゴーのような果物は、熱帯・亜熱帯の植物です。日本で育てられる場所は限られていて、そのひとつが鹿児島県です。",
      },
      { type: "h2", text: "薩摩半島のいちばん南、指宿市山川" },
      {
        type: "p",
        text: "山川園芸のある指宿市山川は、薩摩半島の最南端にあたります。三方を海に囲まれ、冬でも比較的暖かい土地です。海からの風が一年じゅう通っていく場所でもあります。",
      },
      {
        type: "p",
        text: "熱帯の果樹にとっていちばんこわいのは寒さです。冬の冷え込みがゆるやかであることが、南国の果物を育てるうえでの前提になります。",
      },
      { type: "h2", text: "「国産の生ライチ」が珍しい理由" },
      {
        type: "p",
        text: "育てられる土地が限られていること。実がなるまでに年数がかかること。収穫の時期が短いこと。この三つが重なって、国産の生ライチは市場に出る量がとても少ない果物になっています。",
      },
      {
        type: "p",
        text: "だからこそ、産地から直接お届けするという形が向いています。山川園芸では、ライチのほかにもさまざまな熱帯性の果樹を育てています。",
      },
      {
        type: "note",
        text: "農園の日々の様子は公式Instagramでご覧いただけます。",
      },
    ],
    related: [
      { href: "/about", label: "山川園芸について" },
      { href: "/access", label: "農園・アクセス" },
    ],
  },
];

/** 新しい順 */
export const sortedColumns = [...columns].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getColumn(slug: string): ColumnArticle | undefined {
  return columns.find((article) => article.slug === slug);
}

/** 関連記事（同カテゴリー優先で補う） */
export function getRelatedColumns(
  article: ColumnArticle,
  limit = 2,
): ColumnArticle[] {
  const sameCategory = sortedColumns.filter(
    (item) => item.slug !== article.slug && item.category === article.category,
  );
  const others = sortedColumns.filter(
    (item) => item.slug !== article.slug && item.category !== article.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
