/**
 * お知らせ
 *
 * ここに1件追加するだけで /news と TOPページに反映される。
 * date は "YYYY-MM-DD" 形式。新しいものから自動で並び替えられる。
 *
 * category
 *   "sale"    … 販売開始・予約開始・販売終了など
 *   "farm"    … 農園の様子・収穫の状況
 *   "notice"  … 発送・休業などのお知らせ
 */

export type NewsCategory = "sale" | "farm" | "notice";

export type NewsItem = {
  id: string;
  date: string;
  category: NewsCategory;
  title: string;
  /** 本文（段落ごとの配列）。省略可 */
  body?: string[];
  /** 詳細ページや商品ページへのリンク */
  link?: { href: string; label: string };
};

export const newsCategoryLabel: Record<NewsCategory, string> = {
  sale: "販売",
  farm: "農園",
  notice: "お知らせ",
};

/**
 * 確認できたことだけを書く。推測で先の予定を書かないこと。
 * 形式:
 *
 * {
 *   id: "2026-lychee-start",
 *   date: "2026-06-25",
 *   category: "sale",
 *   title: "今年の生ライチの販売を開始しました",
 *   body: ["今年も指宿のライチが実りました。"],
 *   link: { href: "/shop", label: "オンラインショップ" },
 * },
 */
export const news: NewsItem[] = [
  // [確認済] 2026年10月17日 農園より
  //   「櫻井植物園さまより、りゅうがんが売り切れた旨をご連絡致しました」
  //   「今年はドラゴンフルーツは終了いたします」
  //   「現在扱えるのはスターフルーツのみです」
  {
    id: "2026-ryugan-dragonfruit-end",
    date: "2026-10-17",
    category: "sale",
    title: "龍眼とドラゴンフルーツの今季の販売を終了しました",
    body: [
      "龍眼は売り切れとなりました。たくさんのご注文をありがとうございました。",
      "ドラゴンフルーツも、今年の分は終了いたします。次のご用意は来季になります。",
      "ただいまお届けできるのはスターフルーツです。",
    ],
    link: { href: "/shop", label: "オンラインショップ" },
  },
];

/** 新しい順に並べたお知らせ */
export const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

/** TOPページに出す最新のお知らせ */
export function getLatestNews(limit = 3): NewsItem[] {
  return sortedNews.slice(0, limit);
}
