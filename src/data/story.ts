/**
 * 山川園芸のストーリー（/about）
 *
 * ─────────────────────────────────────────────
 * このファイルの使い方
 * ─────────────────────────────────────────────
 * 「なぜ指宿で果物を育てているのか」「なぜライチなのか」「どんな思いで育てているのか」は、
 * 山川園芸にしか書けない、このサイトでいちばん価値のある内容です。
 * ただし現時点では確認が取れていないため、body を null にしてあります。
 *
 * body に文章（段落ごとの配列）を入れると、その章が /about に表示されます。
 * null のままの章は画面に出ません（＝空欄や作り話が表示されることはありません）。
 *
 * 写真も同じで、photo.src に "/images/about/xxx.jpg" を入れると差し替わります。
 *
 * ─────────────────────────────────────────────
 * ヒアリングしたい内容（そのまま質問として使えます）
 * ─────────────────────────────────────────────
 * ・いつから、どんなきっかけでこの土地で果物を育て始めましたか
 * ・数ある果物のなかで、なぜライチだったのですか
 * ・育てるうえで、いちばん気を遣っていることは何ですか
 * ・収穫の時期は、どんな一日を過ごしていますか
 * ・食べてくださる方に、いちばん伝えたいことは何ですか
 * ・ライチのほかに、どんな果樹を育てていますか
 */

export type StoryChapter = {
  id: string;
  /** 章の番号（表示用） */
  index: string;
  /** 見出し */
  title: string;
  /** 本文（段落ごとの配列）。未確認なら null（画面に出ない） */
  body: string[] | null;
  photo: {
    src: string | null;
    alt: string;
    slot: string;
    label: string;
  };
};

export const storyChapters: StoryChapter[] = [
  {
    id: "place",
    index: "01",
    title: "薩摩半島の、いちばん南で",
    // 確認済み：公式オンラインショップの紹介文と所在地にもとづく
    body: [
      "山川園芸があるのは、鹿児島県指宿市山川。薩摩半島の最南端にあたる場所です。",
      "三方を海に囲まれ、一年をとおして風が通り抜けていきます。冬の冷え込みがゆるやかなこの土地は、熱帯の果樹にとって数少ない育つ場所のひとつです。",
      "ここで、ライチをはじめとするさまざまな熱帯性の果樹を育てています。",
    ],
    photo: {
      src: "/images/farm/lychee-trees.jpg",
      alt: "ハウスで育つ山川園芸のライチの木",
      slot: "about/farm-landscape-wide.jpg",
      label: "農園の風景（横位置・大きく使う写真）",
    },
  },
  {
    id: "why-lychee",
    index: "02",
    title: "なぜ、ライチなのか",
    // [TODO] 未確認。ヒアリング後にここへ文章を入れる。
    body: null,
    photo: {
      src: null,
      alt: "木になっているライチ",
      slot: "about/lychee-on-tree.jpg",
      label: "木になっているライチ",
    },
  },
  {
    id: "growing",
    index: "03",
    title: "育てるということ",
    // [TODO] 未確認。栽培方法・栽培年数・農薬についてなど、
    // 確認できていないことは書かないこと。
    body: null,
    photo: {
      src: null,
      alt: "農作業の様子",
      slot: "about/farm-work.jpg",
      label: "農作業の様子",
    },
  },
  {
    id: "producer",
    index: "04",
    title: "つくっている人",
    // [TODO] 代表者名のみ確認済み。経歴・年数・思いは未確認のため書かない。
    body: null,
    photo: {
      src: null,
      alt: "代表の泊久美子",
      slot: "about/producer.jpg",
      label: "生産者のポートレート",
    },
  },
  {
    id: "delivery",
    index: "05",
    title: "産地から、そのまま",
    // 確認済み：農園からの直接販売という事実にもとづく
    body: [
      "穫れたライチは、農園から直接お客様のもとへお送りしています。",
      "生のライチは日もちが長くありません。だからこそ、旬のあいだに、産地から短い距離でお届けする形をとっています。",
      "南さつま市のPICO様の青果コーナーでも、お取り扱いいただいています。",
    ],
    photo: {
      src: "/images/guide/lychee-packing.jpg",
      alt: "袋と箱に詰めた収穫後のライチ",
      slot: "about/lychee-packing.jpg",
      label: "箱詰めの様子",
    },
  },
];

/** 本文が確定している章だけ */
export const publishedChapters = storyChapters.filter(
  (chapter): chapter is StoryChapter & { body: string[] } =>
    chapter.body !== null,
);
