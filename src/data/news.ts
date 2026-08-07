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
 * [TODO] 現在、公開できる確定情報がないため空にしている。
 * 実際のお知らせが決まったら、下記の形式で追加すること。
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
export const news: NewsItem[] = [];

/** 新しい順に並べたお知らせ */
export const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

/** TOPページに出す最新のお知らせ */
export function getLatestNews(limit = 3): NewsItem[] {
  return sortedNews.slice(0, limit);
}
