import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * ブログ記事（content/blog/*.md）の読み込み
 *
 * ─────────────────────────────────────────────
 * このブログの役割
 * ─────────────────────────────────────────────
 * Claude API + GitHub Actions で毎日1記事が自動生成され、
 * content/blog/ に Markdown として追加されます。
 *
 * 記事は「ライチ完全ガイド（/lychee）の支援記事」という位置づけです。
 * ガイドが総合的な検索意図（ライチ 栄養／食べ方／旬 など）を受け持ち、
 * ブログはその周辺の細かい疑問に答えて、ガイドと商品へ送客します。
 * → 生成スクリプト側でカニバリを避ける設計にしています
 *   （scripts/generate-daily-post.ts のトピックプールを参照）。
 *
 * ─────────────────────────────────────────────
 * frontmatter
 * ─────────────────────────────────────────────
 * 必須: title / slug / description / date / category / tags
 * 任意: updatedAt / topicId（生成スクリプトの重複回避に使う）
 *      pillar（この記事が支えるガイドページのURL）
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  category: string;
  tags: string[];
  topicId: string;
  /** この記事が支えるライチ完全ガイドのURL（未設定なら空文字） */
  pillar: string;
};

export type BlogPost = BlogMeta & { content: string };

/** カテゴリー表示名 → URL用スラッグ（/blog/category/[category]） */
export const BLOG_CATEGORIES: { name: string; slug: string }[] = [
  { name: "ライチを買う前に", slug: "before-buying" },
  { name: "保存と鮮度", slug: "storage" },
  { name: "楽しみ方・レシピ", slug: "enjoy" },
  { name: "贈り物のヒント", slug: "gift" },
  { name: "鹿児島・指宿のこと", slug: "kagoshima" },
  { name: "農園とライチづくり", slug: "farm" },
];

/** 既定のカテゴリー（frontmatter が壊れていたときの受け皿） */
const FALLBACK_CATEGORY = "ライチを買う前に";

export function categorySlug(name: string): string {
  return BLOG_CATEGORIES.find((c) => c.name === name)?.slug ?? "before-buying";
}

export function categoryName(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name;
}

/**
 * frontmatter の日付を "YYYY-MM-DD" に揃える。
 *
 * YAMLの `date: 2026-08-09` は、gray-matter（js-yaml）が
 * Dateオブジェクトとして読み込む。そのまま String() すると
 * 「Sun Aug 09 2026 09:00:00 GMT+0900」のような文字列になってしまうため、
 * ここで書かれたとおりの日付に戻す。
 * YAMLの日付はUTCとして解釈されるので、UTC基準で取り出す。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "").trim();
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,、]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function readAll(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slugFromFile = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? slugFromFile),
        title: String(data.title ?? slugFromFile),
        description: String(data.description ?? ""),
        date: toDateString(data.date),
        updatedAt: toDateString(data.updatedAt ?? data.date),
        category: String(data.category ?? FALLBACK_CATEGORY),
        tags: toArray(data.tags),
        topicId: String(data.topicId ?? ""),
        pillar: String(data.pillar ?? ""),
        content: content.trim(),
      };
    });
}

/** 記事メタ一覧（新しい順）。本文は落として一覧を軽くする */
export function getBlogList(): BlogMeta[] {
  return readAll()
    .map((post) => {
      const { content, ...meta } = post;
      void content;
      return meta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** 1記事（本文Markdown付き） */
export function getBlogPost(slug: string): BlogPost | null {
  return readAll().find((post) => post.slug === slug) ?? null;
}

/** 静的生成用の slug 一覧 */
export function getBlogSlugs(): string[] {
  return readAll().map((post) => post.slug);
}

/** 記事が1件以上あるカテゴリー（件数つき） */
export function getBlogCategoriesInUse(): Array<{
  name: string;
  slug: string;
  count: number;
}> {
  const counts = new Map<string, number>();
  for (const post of readAll()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return BLOG_CATEGORIES.map((category) => ({
    ...category,
    count: counts.get(category.name) ?? 0,
  })).filter((category) => category.count > 0);
}

/** カテゴリー別の記事一覧 */
export function getBlogPostsByCategory(slug: string): BlogMeta[] {
  const name = categoryName(slug);
  if (!name) return [];
  return getBlogList().filter((post) => post.category === name);
}

/**
 * 関連記事
 * 同じカテゴリーを優先し、次にタグの一致数、最後に新しい順で並べる。
 */
export function getRelatedBlogPosts(slug: string, limit = 4): BlogMeta[] {
  const all = getBlogList();
  const current = all.find((post) => post.slug === slug);
  if (!current) return all.slice(0, limit);

  return all
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;
      if (post.category === current.category) score += 3;
      score += post.tags.filter((tag) => current.tags.includes(tag)).length;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post);
}

/** 記事が1件でもあるか（0件のあいだ /blog を noindex にするために使う） */
export function hasBlogPosts(): boolean {
  return readAll().length > 0;
}
