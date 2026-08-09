/**
 * ライチ（生）の栄養成分
 *
 * ─────────────────────────────────────────────
 * 出典（絶対に守ること）
 * ─────────────────────────────────────────────
 * すべての数値は、文部科学省「食品成分データベース」
 * 食品番号 07144「果実類／ライチー／生」から転記したもの。
 * 収載は「日本食品標準成分表（八訂）増補2023年」。
 *   https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=7_07144_7
 *
 * ・AIの記憶や一般ブログの数値を書かない。
 * ・成分表が改訂されたら、必ず上記データベースで実際の値を確認してから
 *   このファイルを更新し、edition と checkedAt を書き換える。
 * ・「Tr」は微量（trace）、「0」は未検出または最小記載量に満たないことを表す
 *   成分表の表記なので、勝手に数値へ置き換えない。
 *
 * ─────────────────────────────────────────────
 * 書き方のルール（YMYL）
 * ─────────────────────────────────────────────
 * 栄養は健康情報にあたるため、
 *   「美肌になる」「免疫力が上がる」「貧血が治る」「病気を予防する」
 * といった断定表現は使わない。
 * 「○○の働きに関わる栄養素です」といった、根拠に忠実な書き方に留める。
 */

export const nutritionSource = {
  name: "文部科学省 食品成分データベース",
  itemName: "果実類／ライチー／生（食品番号 07144）",
  edition: "日本食品標準成分表（八訂）増補2023年",
  url: "https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=7_07144_7",
  /** 実際にデータベースを確認した日 */
  checkedAt: "2026-08-09",
};

export type NutrientRow = {
  name: string;
  /** 成分表の表記のまま。"Tr" もそのまま扱う */
  value: string;
  unit: string;
  /** 表の区分 */
  group: "basic" | "mineral" | "vitamin";
};

/** 可食部100gあたり */
export const nutrients: NutrientRow[] = [
  { name: "エネルギー", value: "61", unit: "kcal", group: "basic" },
  { name: "水分", value: "82.1", unit: "g", group: "basic" },
  { name: "たんぱく質", value: "1.0", unit: "g", group: "basic" },
  { name: "脂質", value: "0.1", unit: "g", group: "basic" },
  { name: "炭水化物", value: "16.4", unit: "g", group: "basic" },
  { name: "食物繊維総量", value: "0.9", unit: "g", group: "basic" },
  { name: "灰分", value: "0.4", unit: "g", group: "basic" },

  { name: "ナトリウム", value: "Tr", unit: "mg", group: "mineral" },
  { name: "カリウム", value: "170", unit: "mg", group: "mineral" },
  { name: "カルシウム", value: "2", unit: "mg", group: "mineral" },
  { name: "マグネシウム", value: "13", unit: "mg", group: "mineral" },
  { name: "リン", value: "22", unit: "mg", group: "mineral" },
  { name: "鉄", value: "0.2", unit: "mg", group: "mineral" },
  { name: "亜鉛", value: "0.2", unit: "mg", group: "mineral" },
  { name: "銅", value: "0.14", unit: "mg", group: "mineral" },

  { name: "ビタミンE（α-トコフェロール）", value: "0.1", unit: "mg", group: "vitamin" },
  { name: "ビタミンK", value: "Tr", unit: "µg", group: "vitamin" },
  { name: "ビタミンB1", value: "0.02", unit: "mg", group: "vitamin" },
  { name: "ビタミンB2", value: "0.06", unit: "mg", group: "vitamin" },
  { name: "ナイアシン", value: "1.0", unit: "mg", group: "vitamin" },
  { name: "ビタミンB6", value: "0.09", unit: "mg", group: "vitamin" },
  { name: "葉酸", value: "100", unit: "µg", group: "vitamin" },
  { name: "ビタミンC", value: "36", unit: "mg", group: "vitamin" },
];

/** 廃棄率（皮と種を除いた可食部の割合を考えるときに使う） */
export const wasteRate = { value: "30", unit: "%", note: "皮、種子" };

export const nutrientGroupLabel: Record<NutrientRow["group"], string> = {
  basic: "エネルギーと主な成分",
  mineral: "無機質（ミネラル）",
  vitamin: "ビタミン",
};

/**
 * 主な栄養素の説明。
 * 効果効能を断定せず、「体内で何に関わる栄養素か」という説明にとどめる。
 * 表現を変えるときも、この方針を崩さないこと。
 */
export const nutrientNotes: Array<{
  name: string;
  amount: string;
  body: string;
}> = [
  {
    name: "ビタミンC",
    amount: "36mg",
    body: "ライチに比較的多く含まれる栄養素です。体内でコラーゲンの生成に関わる水溶性のビタミンで、水に溶けやすく熱に弱い性質があります。生のまま食べる果物から摂りやすい栄養素のひとつです。",
  },
  {
    name: "葉酸",
    amount: "100µg",
    body: "水溶性のビタミンB群のひとつで、細胞の生成に関わる栄養素です。果物のなかでは比較的多く含まれています。",
  },
  {
    name: "カリウム",
    amount: "170mg",
    body: "体液の浸透圧を保つ働きに関わる無機質（ミネラル）です。多くの果物に含まれています。",
  },
  {
    name: "炭水化物",
    amount: "16.4g",
    body: "うち食物繊維総量が0.9gです。ライチの甘みはこの炭水化物によるものです。",
  },
];

/** 参考資料（画面下部に表示する） */
export const nutritionReferences: Array<{
  label: string;
  publisher: string;
  url: string;
}> = [
  {
    label: "食品成分データベース 果実類／ライチー／生（食品番号 07144）",
    publisher: "文部科学省",
    url: nutritionSource.url,
  },
  {
    label: "日本食品標準成分表2020年版（八訂）",
    publisher: "文部科学省",
    url: "https://www.mext.go.jp/a_menu/syokuhinseibun/mext_01110.html",
  },
];
