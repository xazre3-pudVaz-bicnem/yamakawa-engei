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
 * ライチの知識は /lychee のガイドが担当します
 * ─────────────────────────────────────────────
 * ライチそのものの解説（栄養・食べ方・旬・保存・生ライチ・産地など）は
 * すべて /lychee 配下のガイドに集約しました。
 * ここに同じ検索意図の記事を書くと、ガイドと共倒れになります
 * （カニバリゼーション）。必ず data/lycheeGuide.ts の intent 欄を
 * 確認してから記事を追加してください。
 *
 * ─────────────────────────────────────────────
 * このコラムに向いているのは「農園の記録」
 * ─────────────────────────────────────────────
 * ガイドが扱わない、その年その時にしか書けない話がここの役目です。
 *   ・今年の花の咲き方、実のふくらみ方
 *   ・収穫が始まった日の様子
 *   ・選果や箱詰めの一日
 *   ・今年の出来、天候の影響
 *   ・お客様からいただいた声
 * これらは農園に伺わないと書けない内容なので、
 * 情報をいただいてから追加してください。
 *
 * ─────────────────────────────────────────────
 * 書くときの約束
 * ─────────────────────────────────────────────
 * - 山川園芸の栽培方法・糖度など、確認できていないことは書かない。
 * - 果物一般の話と、山川園芸の話を混ぜない。
 * - 記事が0件のあいだ、/column は noindex になり sitemap にも載りません。
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

/**
 * 記事の一覧
 *
 * ライチの解説記事（旬・ギフト・指宿の気候）は、
 * 検索意図が /lychee のガイドと重なるため、そちらへ統合しました。
 * 旧URLは next.config.ts で新しいガイドページへ転送しています。
 *
 * 農園から「今年の記録」を伺えたら、下記の形式で追加してください。
 *
 * {
 *   slug: "2026-harvest-start",
 *   title: "今年の収穫が始まりました",
 *   excerpt: "…",
 *   category: "farm",
 *   date: "2026-07-05",
 *   updated: null,
 *   keywords: ["山川園芸 収穫"],
 *   body: [{ type: "p", text: "…" }],
 *   related: [{ href: "/shop", label: "オンラインショップ" }],
 * },
 */
export const columns: ColumnArticle[] = [];
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
