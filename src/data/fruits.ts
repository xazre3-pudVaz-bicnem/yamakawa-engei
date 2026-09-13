/**
 * 山川園芸で育てている果物（ライチ以外）
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * fruits 配列に1件追加するだけで、
 *   /fruits（一覧）
 *   /fruits/[slug]（詳細）
 *   sitemap.xml
 *   パンくず・FAQ の構造化データ
 * にすべて反映される。JSXに果物の説明を直接書かないこと。
 *
 * ─────────────────────────────────────────────
 * 記載ルール（重要）
 * ─────────────────────────────────────────────
 * 書いてよいのは次の2つだけ。
 *   1. 果物そのものの一般的な事実（分類・原産・見た目・食べ方）
 *   2. 農園から届いた写真に写っていること（ハウスで育つ・花・実の様子）
 *
 * 山川園芸の栽培についての事実（収穫時期・品種・味）は
 * 伺っていないため書かない。分かったものから null を埋めること。
 *
 * [確認済] ここに載せている果物は販売しない（2026年9月11日 確認）。
 * 農園で育てている果物として紹介するページであり、購入の問い合わせへは誘導しない。
 * 栄養の数値は載せない（CLAUDE.md の YMYL ルール。成分表の出典がないため）。
 *
 * 出典の凡例
 *   [確認済] ご本人から提供された情報（写真を含む）
 *   [一般]   果物としての一般的な事実
 *   [TODO]   未確認。要ヒアリング
 */

import { getProduct, isBuyable, type Product } from "./products";

export type FruitPhoto = {
  /** /public 配下のパス */
  src: string;
  /** 写真に写っているものをそのまま書く */
  alt: string;
  /** 写真の下に添える一文。写っていることだけを書く */
  caption: string;
};

export type Fruit = {
  slug: string;
  /** 表示名 */
  name: string;
  /** 読み（漢字名のときだけ） */
  reading: string | null;
  /** 見出しの上の英字 */
  nameEn: string;
  /** 別名 */
  otherNames: string[];

  /** 検索結果・OGPに出す内容 */
  meta: {
    title: string;
    /** 120文字以内 */
    description: string;
    keywords: string[];
  };

  /** 見出しの下の一文 */
  lead: string;
  /** 冒頭の最短回答（2〜3文で言い切る） */
  answer: { question: string; body: string };
  /** 導入の本文（段落ごと） */
  intro: string[];

  /** 大きく見せる1枚 */
  hero: FruitPhoto;
  /** 農園の様子。1枚目を大きく、2・3枚目を並べて見せる */
  farm: {
    heading: string;
    body: string[];
    photos: [FruitPhoto, FruitPhoto, FruitPhoto];
  };

  /** 特徴の一覧（一般的な事実） */
  features: Array<{ label: string; value: string }>;
  /** 食べ方の手順 */
  howToEat: string[];
  /** 食べ方のそばに置く写真（切り口など）。無ければ省く */
  howToEatPhoto?: FruitPhoto;
  /**
   * 農園ご本人から伺った話。
   * ★伺っていない内容をここに書かないこと★
   * 出どころ（いつ・何で伺ったか）をコメントに残す。
   */
  farmNote?: { body: string[] };
  /** 食べるときの注意 */
  cautions: string[];
  /** よくある質問。お取り扱いの質問は自動で足される */
  faqs: Array<{ question: string; answer: string }>;

  /** 山川園芸での収穫時期。[TODO] 伺っていないため null */
  harvestSeason: string | null;
  /**
   * 販売するか。
   * false のあいだは「販売していません」と案内し、
   * かわりに山川園芸のライチ（ShopCta）へつなぐ。
   */
  forSale: boolean;
  /**
   * 販売する場合の、オンラインショップの商品の slug。
   * forSale を true にし、products.ts に商品を追加してから入れる。
   */
  productSlug: string | null;

  /** 関連して読んでほしいページ */
  related: Array<{ href: string; label: string }>;

  /** 内容を最後に見直した日 */
  updatedAt: string;
};

/* ================================================================
   果物
================================================================ */

export const fruits: Fruit[] = [
  /* ──────────────────────────────────────────────
     ドラゴンフルーツ
  ────────────────────────────────────────────── */
  {
    slug: "dragon-fruit",
    name: "ドラゴンフルーツ",
    reading: null,
    nameEn: "Dragon fruit",
    otherNames: ["ピタヤ"], // [一般]

    meta: {
      title: "ドラゴンフルーツ｜鹿児島・指宿のハウスで育つ南国の果実",
      description:
        "鹿児島県指宿市山川の山川園芸で育てているドラゴンフルーツ。花が咲いて実が色づくまでの様子と、特徴・食べ方・種は食べられるかをご紹介します。",
      keywords: [
        "ドラゴンフルーツ",
        "ドラゴンフルーツ 鹿児島",
        "ドラゴンフルーツ 指宿",
        "国産 ドラゴンフルーツ",
        "ピタヤ",
      ],
    },

    lead: "サボテンの仲間の植物に実る、あざやかな赤紫の果実です。",

    answer: {
      question: "ドラゴンフルーツとは？",
      body: "サボテン科の植物になる果実で、ピタヤとも呼ばれます。赤紫の皮に、緑色のうろこのような突起がつくのが特徴です。果肉には小さな黒い種が散らばっていて、種ごと食べられます。",
    },

    intro: [
      // [確認済] ハウスで育てていることは農園の写真で確認
      "山川園芸のハウスでは、ドラゴンフルーツも育てています。",
      // [一般]
      "サボテンの仲間なので、葉のように見えるのは、平たく長く伸びた茎です。その茎から花が咲き、実がなります。",
    ],

    hero: {
      src: "/images/fruits/dragon-fruit/ripe-closeup.jpg",
      alt: "山川園芸で赤紫に色づいたドラゴンフルーツの実",
      caption: "赤紫に色づいたドラゴンフルーツ",
    },

    farm: {
      heading: "花が咲いて、実が色づくまで",
      body: [
        "山川園芸で撮った写真です。白い大きな花が咲いたあと、緑色の実がふくらみ、やがて赤紫に色づいていきます。",
      ],
      photos: [
        {
          src: "/images/fruits/dragon-fruit/ripe-on-stem.jpg",
          alt: "緑の茎の先で赤紫に色づいたドラゴンフルーツ",
          caption: "茎の先で色づいた実",
        },
        {
          src: "/images/fruits/dragon-fruit/flower-open.jpg",
          alt: "ドラゴンフルーツの大きな白い花。中心に雌しべと黄色い雄しべ",
          caption: "開いた花。中心に雌しべと雄しべ",
        },
        {
          src: "/images/fruits/dragon-fruit/green-fruits.jpg",
          alt: "茎についた、色づく前の緑色のドラゴンフルーツ",
          caption: "色づく前の、緑色の実",
        },
      ],
    },

    // [一般] 果物としての一般的な特徴
    features: [
      { label: "分類", value: "サボテン科" },
      { label: "別名", value: "ピタヤ" },
      { label: "原産", value: "中南米" },
      { label: "皮", value: "赤紫色。緑色のうろこのような突起がつく" },
      { label: "果肉", value: "白いもの、赤いものなどがある" },
      { label: "種", value: "小さな黒い種。果肉と一緒に食べられる" },
    ],

    howToEat: [
      "冷蔵庫でよく冷やしてから、縦半分に切ります。",
      "スプーンですくって食べるか、皮をむいて食べやすい大きさに切ります。",
      "黒い種は取らずに、そのまま食べられます。",
    ],

    // [確認済] 2026年9月13日にいただいた写真。切ると白い果肉に黒い種
    howToEatPhoto: {
      src: "/images/fruits/dragon-fruit/halved.jpg",
      alt: "半分に切ったドラゴンフルーツ。白い果肉に黒い種が散らばっている",
      caption: "半分に切ったところ。白い果肉に、黒い種",
    },

    cautions: [
      "果肉が赤いものは、果汁が服や手につくと落ちにくいことがあります。",
    ],

    faqs: [
      {
        question: "ドラゴンフルーツの種は食べられますか？",
        answer:
          "食べられます。果肉に散らばる小さな黒い種は、取り除かずにそのまま召し上がれます。",
      },
      {
        question: "ドラゴンフルーツはどうやって食べますか？",
        answer:
          "よく冷やしてから縦半分に切り、スプーンですくって食べるのが手軽です。皮をむいて、食べやすい大きさに切っても食べられます。",
      },
    ],

    harvestSeason: null, // [TODO] 山川園芸での収穫時期
    forSale: false, // [確認済] 販売しない
    productSlug: null,

    related: [
      { href: "/lychee", label: "ライチ完全ガイドを読む" },
      { href: "/access", label: "指宿市山川の農園について見る" },
    ],

    updatedAt: "2026-09-10",
  },

  /* ──────────────────────────────────────────────
     龍眼（リュウガン）
  ────────────────────────────────────────────── */
  {
    slug: "longan",
    name: "龍眼",
    reading: "りゅうがん",
    nameEn: "Longan",
    otherNames: ["リュウガン", "ロンガン"], // [一般]

    meta: {
      title: "龍眼（リュウガン）｜ライチの仲間・鹿児島指宿の農園から",
      description:
        "龍眼（リュウガン）はライチと同じムクロジ科の果物。鹿児島県指宿市山川の山川園芸のハウスで房になって実る様子と、特徴・食べ方・ライチとの違いをご紹介します。",
      keywords: [
        "龍眼",
        "リュウガン",
        "ロンガン",
        "龍眼 国産",
        "龍眼 ライチ 違い",
        "龍眼 鹿児島",
      ],
    },

    lead: "ライチの仲間。房になって実る、薄茶色の小さな果実です。",

    answer: {
      question: "龍眼（リュウガン）とは？",
      body: "ライチと同じムクロジ科の果物です。薄茶色の皮をむくと、半透明の白い果肉があらわれます。果肉越しに透ける黒い種が龍の目のように見えることが、名前の由来とされています。",
    },

    intro: [
      // [確認済] ハウスで育てていることは農園の写真で確認
      "山川園芸のハウスでは、ライチの仲間の龍眼も育てています。",
      // [確認済] 房になって実る様子は写真で確認 / [一般] 見た目の違い
      "実は枝先に房のようにまとまってなります。ライチより小ぶりで、皮は赤ではなく、なめらかな薄茶色です。",
    ],

    hero: {
      src: "/images/fruits/longan/cluster-hires.jpg",
      alt: "山川園芸で枝から下がる龍眼の実の房",
      caption: "枝から下がる龍眼の房",
    },

    farm: {
      heading: "枝先に、房になって",
      body: [
        "山川園芸で撮った写真です。細い枝の先に、薄茶色の実がいくつもまとまって下がります。",
      ],
      photos: [
        {
          src: "/images/fruits/longan/clusters.jpg",
          alt: "枝先に房になって実る龍眼",
          caption: "枝先に房になって実る龍眼",
        },
        {
          src: "/images/fruits/longan/cluster-closeup.jpg",
          alt: "葉のあいだに実った龍眼の房",
          caption: "葉のあいだの、薄茶色の房",
        },
        {
          src: "/images/fruits/longan/greenhouse-tree-hires.jpg",
          alt: "ハウスの中で実をつけた龍眼の木",
          caption: "ハウスの中の龍眼の木",
        },
      ],
    },

    // [一般] 果物としての一般的な特徴
    features: [
      { label: "分類", value: "ムクロジ科（ライチと同じ仲間）" },
      { label: "別名", value: "リュウガン、ロンガン" },
      { label: "原産", value: "中国南部〜東南アジア" },
      { label: "皮", value: "薄茶色で薄く、手でむける" },
      { label: "果肉", value: "半透明の白" },
      { label: "種", value: "黒くて丸い種がひとつ。食べない" },
    ],

    howToEat: [
      "皮に爪を立てると、手でかんたんにむけます。",
      "果肉を口に入れ、中の黒い種は出してください。",
      "冷蔵庫で冷やしてから食べるのもおすすめです。",
    ],

    cautions: ["種は食べずに、取り除いてください。"],

    faqs: [
      {
        question: "龍眼とライチの違いは？",
        answer:
          "どちらもムクロジ科の果物で、皮をむくと白い果肉と黒い種がある点は同じです。龍眼はライチより小ぶりで、皮は赤ではなく薄茶色です。",
      },
      {
        question: "龍眼の種は食べられますか？",
        answer: "種は食べずに、取り除いてください。",
      },
    ],

    harvestSeason: null, // [TODO] 山川園芸での収穫時期
    forSale: false, // [確認済] 販売しない
    productSlug: null,

    related: [
      { href: "/lychee", label: "仲間のライチについて、ライチ完全ガイドで読む" },
      { href: "/lychee/how-to-eat", label: "ライチの皮のむき方と食べ方を見る" },
    ],

    updatedAt: "2026-09-10",
  },

  /* ──────────────────────────────────────────────
     ホワイトサポテ
  ────────────────────────────────────────────── */
  {
    slug: "white-sapote",
    name: "ホワイトサポテ",
    reading: null,
    nameEn: "White sapote",
    otherNames: [],

    meta: {
      title: "ホワイトサポテ｜鹿児島・指宿の農園で育つ南国の果物",
      description:
        "ホワイトサポテはメキシコから中央アメリカが原産のミカン科の果物。アボカドのように追熟させるとメロンのように甘くなります。鹿児島県指宿市山川の山川園芸で育つ実の様子と、食べごろの目安・食べ方をご紹介します。",
      keywords: [
        "ホワイトサポテ",
        "ホワイトサポテ 食べ方",
        "ホワイトサポテ 食べごろ",
        "ホワイトサポテ 国産",
        "ホワイトサポテ 鹿児島",
      ],
    },

    lead: "緑の皮の中に、クリーム色のなめらかな果肉が詰まった果物です。",

    answer: {
      question: "ホワイトサポテとは？",
      body: "メキシコから中央アメリカが原産の、ミカン科の果物です。緑色の皮の中に、クリーム色のなめらかな果肉が詰まっています。アボカドのように追熟させると、メロンのように甘くなります。",
    },

    intro: [
      // [確認済] 木に実る様子・収穫後の様子は農園の写真で確認
      "山川園芸でもホワイトサポテを育てています。木には、緑色の丸い実がなります。",
      // [一般]
      "名前に「サポテ」とつきますが、ミカン科の植物です。",
    ],

    hero: {
      src: "/images/fruits/white-sapote/on-tree-hires.jpg",
      alt: "山川園芸で木になったホワイトサポテの緑色の実",
      caption: "木になったホワイトサポテ",
    },

    farm: {
      heading: "木の実から、切り口まで",
      body: [
        "山川園芸で撮った写真です。木になった緑色の実を収穫し、切ると、クリーム色の果肉と種があらわれます。",
      ],
      photos: [
        {
          src: "/images/fruits/white-sapote/cut.jpg",
          alt: "半分に切ったホワイトサポテ。クリーム色の果肉と種",
          caption: "切ると、クリーム色の果肉",
        },
        {
          src: "/images/fruits/white-sapote/harvested.jpg",
          alt: "かごに入れた、収穫したホワイトサポテ",
          caption: "収穫したホワイトサポテ",
        },
        {
          src: "/images/fruits/white-sapote/bagged.jpg",
          alt: "ひとつずつ袋に入れたホワイトサポテ",
          caption: "ひとつずつ袋に入れた実",
        },
      ],
    },

    // [一般] 果物としての一般的な特徴
    features: [
      { label: "分類", value: "ミカン科" },
      { label: "原産", value: "メキシコ〜中央アメリカ" },
      { label: "皮", value: "緑色〜黄緑色。食べない" },
      { label: "果肉", value: "クリーム色で、ねっとりとなめらか" },
      { label: "種", value: "大きめの種が入っている。食べない" },
    ],

    // [確認済] 山川園芸の販売用POP（2026年9月13日にいただいたもの）より
    howToEat: [
      "緑のうちは、アボカドのように常温で追熟させます。",
      "指で押してやわらかく感じるころが食べごろです。半分に切り、種を取り除きます。",
      "皮は食べずに、アイスクリームのようにスプーンですくって食べます。",
    ],

    // [確認済] 山川園芸の販売用POP（2026年9月13日）に書かれていた内容
    farmNote: {
      body: [
        "緑の実は、アボカドのように熟成させてください。やわらかくなると、メロンのように甘くなります。",
        "ねっとりとしたクリームのような果肉です。アイスクリームみたいに、すくってお召し上がりください。",
      ],
    },

    cautions: ["種と皮は食べないでください。"],

    faqs: [
      {
        question: "ホワイトサポテの食べごろは？",
        answer:
          "緑のうちは、アボカドのように常温で追熟させてください。指で押してやわらかく感じるころが食べごろです。やわらかくなると、メロンのように甘くなります。",
      },
      {
        question: "ホワイトサポテの種や皮は食べられますか？",
        answer: "種と皮は食べずに、クリーム色の果肉だけを召し上がってください。",
      },
    ],

    harvestSeason: null, // [TODO] 山川園芸での収穫時期
    forSale: false, // [確認済] 販売しない
    productSlug: null,

    related: [
      { href: "/lychee", label: "ライチ完全ガイドを読む" },
      { href: "/access", label: "指宿市山川の農園について見る" },
    ],

    updatedAt: "2026-09-10",
  },
];

/* ================================================================
   ページはまだ作っていない果物
   ---------------------------------------------------------------
   写真はいただいているが、紹介文を書けるだけの材料が揃っていないもの。
   写真と話が増えたら、上の fruits 配列に移してページを作る。
================================================================ */

export const alsoGrowing: Array<{ name: string; photo: FruitPhoto }> = [
  {
    // [確認済] 2026年9月13日にいただいた写真
    name: "グァバ",
    photo: {
      src: "/images/fruits/guava/on-branch.jpg",
      alt: "山川園芸のハウスで枝についた、緑色のグァバの実",
      caption: "枝についたグァバの実",
    },
  },
];

/* ================================================================
   参照ヘルパー
================================================================ */

/** 一覧・詳細ページのパス */
export function fruitPath(slug: string): string {
  return `/fruits/${slug}`;
}

/** slug から果物を引く */
export function getFruit(slug: string): Fruit | undefined {
  return fruits.find((fruit) => fruit.slug === slug);
}

/** 表示名。読みがあれば「龍眼（りゅうがん）」の形にする */
export function fruitDisplayName(fruit: Fruit): string {
  return fruit.reading ? `${fruit.name}（${fruit.reading}）` : fruit.name;
}

/**
 * オンラインショップで買えるか。
 * productSlug が入っていて、その商品が実際に販売中のときだけ商品を返す。
 */
export function getFruitProduct(fruit: Fruit): Product | null {
  if (!fruit.forSale || !fruit.productSlug) return null;
  const product = getProduct(fruit.productSlug);
  return product && isBuyable(product) ? product : null;
}

/**
 * お取り扱いについての質問と回答。
 * 販売の状況に合わせて自動で文言が変わるので、FAQ に手で書かないこと。
 */
export function fruitAvailabilityFaq(fruit: Fruit): {
  question: string;
  answer: string;
} {
  const product = getFruitProduct(fruit);
  return {
    question: `山川園芸の${fruit.name}は買えますか？`,
    answer: !fruit.forSale
      ? `${fruit.name}は販売していません。山川園芸で育てている果物として、農園の様子をご紹介しています。オンラインショップでお届けしているのは生ライチです。`
      : product
        ? `オンラインショップで「${product.name}」をお取り扱いしています。`
        : `いまはオンラインショップでのお取り扱いがありません。`,
  };
}

/** そのページに載せるFAQ（お取り扱いの質問を最後に足す） */
export function fruitFaqs(fruit: Fruit) {
  return [...fruit.faqs, fruitAvailabilityFaq(fruit)];
}
