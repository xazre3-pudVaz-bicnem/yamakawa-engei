/**
 * 毎日1記事を Claude API で自動生成し、content/blog/ に Markdown で保存します。
 * GitHub Actions（.github/workflows/daily-blog.yml）から実行されます。
 *
 * 実行:  npx tsx scripts/generate-daily-post.ts
 *
 * 必要な環境変数:
 *   - ANTHROPIC_API_KEY（必須）
 *   - ANTHROPIC_MODEL（任意。未設定なら Haiku を使用）
 *
 * 方針:
 *   - コスト削減のためデフォルトは claude-haiku-4-5-20251001
 *   - トピックプールから未使用のテーマを選び、重複を避ける
 *   - frontmatter(title/slug/description/date/category/tags/topicId/pillar) を必ず付与
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { salesStatus, salesPhaseCopy } from "../src/data/siteConfig";
import { RATE_TABLE } from "../src/data/shipping";

/* ================================================================
   設定
================================================================ */

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

const SITE = {
  name: "山川園芸",
  baseUrl: "https://www.yamakawaengei.com",
  owner: "泊 久美子",
  address: "鹿児島県指宿市山川新生町101",
  area: "鹿児島県指宿市・山川",
  business: "国産ライチの栽培・販売（産地直送のオンラインショップ）",
  hours: "8:00〜17:00（収穫の繁忙期は土日祝も対応）",
} as const;

/**
 * 事実の土台。ここに書いてあることだけを前提に書かせる。
 * サイト側（src/data/siteConfig.ts / products.ts）と食い違わないよう、
 * 内容を変えたときは必ず両方を確認すること。
 */
const FACTS = [
  "鹿児島県指宿市山川でライチをはじめとする熱帯果樹をハウスで育てている農園である",
  "旬のあいだだけ、農園から産地直送で生ライチを届けている",
  "お届けできる時期は7月上旬からお盆ごろまで（その年の天候で前後する）",
  "収穫の時期で品種が変わる。7月ごろは三月紅・在来種（佐多、黒葉）、8月ごろは宮崎ライチと呼ばれる種・桂味・ノーマイチー",
  "品種を指定しての購入は受けていない。その時期に採れたもののなかから良い状態のものを届けている",
  "商品は「生ライチ 500g（税込2,500円）」と「生ライチ 350g（税込1,800円）」の2種類",
  "配送はヤマト運輸のクール便のみ。お届け地域は離島を除く全国",
  `送料はお届け先の地域で変わる。60サイズのクール宅急便で、1個口あたり${Math.min(...RATE_TABLE.map((r) => r.total)).toLocaleString("ja-JP")}円〜${Math.max(...RATE_TABLE.map((r) => r.total)).toLocaleString("ja-JP")}円（税込）。地域別の金額は /shipping に掲載している`,
  "1個口に入るのは350gなら3点まで、500gなら2点までが目安。入りきらない分は個口数が増える",
  "のし・ギフト包装・メッセージカードには対応していない",
  "包装はジッパー付きの袋のほか、店頭販売と同じ包装にも対応している",
  "保存は冷蔵庫で、乾燥を防ぐため袋や容器に入れる。目安は数日から1週間ほど",
  "農園での直売・見学は、事前に連絡があれば対応している",
];

/**
 * いまの販売状況。src/data/siteConfig.ts の salesStatus を読んでいるので、
 * サイトを販売終了に切り替えれば、記事の書き方も自動で変わる。
 * ここに販売状況を手書きしないこと（サイトとずれる）。
 */
const IS_SELLING =
  salesStatus.phase === "on_sale" || salesStatus.phase === "preorder";

const SALES_FACT = IS_SELLING
  ? `現在は「${salesPhaseCopy[salesStatus.phase].label}」。オンラインショップで注文できる`
  : `現在は「${salesPhaseCopy[salesStatus.phase].label}」。いまは注文を受け付けていない。次の収穫は来年の初夏`;

FACTS.push(SALES_FACT);

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/* ================================================================
   内部リンク（実在するページのみ）
================================================================ */

/** 商品・購入まわり */
const SHOP_LINKS = [
  { url: "/shop", label: "オンラインショップ" },
  { url: "/products/nama-lychee-500g", label: "生ライチ 500g" },
  { url: "/products/nama-lychee-350g", label: "生ライチ 350g" },
  { url: "/guide", label: "お買い物ガイド" },
  { url: "/shipping", label: "配送・送料について" },
  { url: "/faq", label: "よくある質問" },
  { url: "/about", label: "山川園芸について" },
  { url: "/access", label: "農園・アクセス" },
  { url: "/contact", label: "お問い合わせ" },
];

/**
 * ライチ完全ガイド（/lychee 配下）＝ トピッククラスターの“柱”。
 * ブログ記事から必ず柱へリンクを張り、サイト内の評価を集約させる。
 */
const PILLAR_PAGES = [
  { url: "/lychee", label: "ライチ完全ガイド" },
  { url: "/lychee/nutrition", label: "ライチの栄養" },
  { url: "/lychee/how-to-eat", label: "ライチの食べ方・皮のむき方" },
  { url: "/lychee/season", label: "ライチの旬" },
  { url: "/lychee/storage", label: "ライチの保存方法" },
  { url: "/lychee/fresh", label: "生ライチとは" },
  { url: "/lychee/fresh-vs-frozen", label: "生ライチと冷凍ライチの違い" },
  { url: "/lychee/domestic", label: "国産ライチとは" },
  { url: "/lychee/kagoshima", label: "鹿児島のライチ" },
  { url: "/lychee/ibusuki", label: "指宿とライチ・熱帯果樹" },
  { url: "/lychee/how-to-choose", label: "ライチの選び方" },
  { url: "/lychee/taste", label: "ライチはどんな味？" },
  { url: "/lychee/gift", label: "ライチをギフトに" },
  { url: "/lychee/recipes", label: "ライチの楽しみ方" },
];

/* ================================================================
   トピックプール
   ---------------------------------------------------------------
   【重要・キーワードのすみ分け】
   このブログは、ライチ完全ガイド（/lychee 配下14ページ）の“支援記事”です。

     - /lychee/nutrition  … 「ライチ 栄養」「カロリー」「ビタミンC」「葉酸」
     - /lychee/how-to-eat … 「ライチ 食べ方」「皮 むき方」「種」
     - /lychee/season     … 「ライチ 旬」「時期」「収穫時期」
     - /lychee/storage    … 「ライチ 保存方法」「日持ち」「冷蔵」「冷凍」
     - /lychee/fresh 他   … 「生ライチ」「国産ライチ」「鹿児島 ライチ」など

   これらの総合テーマは、すべてガイド側が受け持ちます。
   本プールでは同じ検索意図を扱わず、**より具体的で細かい疑問**だけを扱います。
   （同じ意図の記事を作ると、ガイドとブログが共倒れになります＝カニバリゼーション）

   テーマを足すときは、必ず src/data/lycheeGuide.ts の intent 欄を確認し、
   重複していないことを確かめてから追加してください。
   pillar には、その記事が支えるガイドページのURLを入れます。
================================================================ */

type Topic = {
  id: string;
  theme: string;
  slugBase: string;
  category: string;
  /** この記事が支えるガイドページ（必ずリンクさせる） */
  pillar: string;
};

const TOPICS: Topic[] = [
  /* ---- ライチを買う前に ---- */
  { id: "first-time-guide", theme: "ライチを初めて食べる方が、届く前に知っておくと安心なこと", slugBase: "lychee-first-time-guide", category: "ライチを買う前に", pillar: "/lychee" },
  { id: "buy-caution", theme: "ライチを購入するときに確認しておきたいこと", slugBase: "lychee-buy-caution", category: "ライチを買う前に", pillar: "/lychee/how-to-choose" },
  { id: "otoriyose-merit", theme: "ライチをお取り寄せで買うと、店頭で買うのと何が違うのか", slugBase: "lychee-otoriyose-merit", category: "ライチを買う前に", pillar: "/lychee/domestic" },
  { id: "order-timing", theme: "季節限定の果物は、いつ注文するのがいいのか", slugBase: "lychee-order-timing", category: "ライチを買う前に", pillar: "/lychee/season" },
  { id: "how-much", theme: "ライチは何グラム買えばいい？人数と食べ方から考える", slugBase: "lychee-how-much-to-buy", category: "ライチを買う前に", pillar: "/shop" },
  { id: "first-order-flow", theme: "産地直送のフルーツを初めて注文するときの流れ", slugBase: "farm-direct-order-flow", category: "ライチを買う前に", pillar: "/guide" },
  { id: "fresh-or-frozen-choose", theme: "生と冷凍、どちらを買うか迷ったときの決め方", slugBase: "lychee-fresh-or-frozen-choose", category: "ライチを買う前に", pillar: "/lychee/fresh-vs-frozen" },
  { id: "rare-reason", theme: "国産の生ライチが希少といわれるのはなぜか", slugBase: "domestic-lychee-rare-reason", category: "ライチを買う前に", pillar: "/lychee/domestic" },

  /* ---- 保存と鮮度 ---- */
  { id: "freshness-tips", theme: "届いたライチの鮮度をできるだけ保つための小さなコツ", slugBase: "lychee-freshness-tips", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "skin-brown", theme: "ライチの皮が茶色くなってきたときに考えること", slugBase: "lychee-skin-turning-brown", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "freeze-tips", theme: "ライチを冷凍するときの、ちょっとしたコツ", slugBase: "lychee-freezing-tips", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "eat-by-when", theme: "ライチはいつまでに食べきる？予定から逆算して考える", slugBase: "lychee-eat-by-when", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "fridge-place", theme: "冷蔵庫のどこに置く？ライチの置き場所を考える", slugBase: "lychee-where-in-fridge", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "share-with-others", theme: "ライチをおすそ分けするときに気をつけたいこと", slugBase: "lychee-sharing-tips", category: "保存と鮮度", pillar: "/lychee/storage" },
  { id: "receive-timing", theme: "生鮮の果物を受け取る日を決めるときに考えること", slugBase: "fresh-fruit-receiving-day", category: "保存と鮮度", pillar: "/lychee/storage" },

  /* ---- 楽しみ方・レシピ ---- */
  { id: "dessert-ideas", theme: "ライチを使った、手のかからないデザートのアイデア", slugBase: "lychee-simple-dessert-ideas", category: "楽しみ方・レシピ", pillar: "/lychee/recipes" },
  { id: "drink-idea", theme: "ライチを飲みものに使うという楽しみ方", slugBase: "lychee-drink-ideas", category: "楽しみ方・レシピ", pillar: "/lychee/recipes" },
  { id: "pairing", theme: "ライチと相性のよい食材を考えてみる", slugBase: "lychee-food-pairing", category: "楽しみ方・レシピ", pillar: "/lychee/recipes" },
  { id: "aroma", theme: "ライチの香りは、どんな香りなのか", slugBase: "lychee-aroma", category: "楽しみ方・レシピ", pillar: "/lychee/taste" },
  { id: "with-kids", theme: "子どもと一緒にライチを食べるときに気をつけること", slugBase: "lychee-with-kids", category: "楽しみ方・レシピ", pillar: "/lychee/how-to-eat" },
  { id: "peel-clean", theme: "ライチの皮を、手をあまり汚さずにむくには", slugBase: "lychee-peel-without-mess", category: "楽しみ方・レシピ", pillar: "/lychee/how-to-eat" },
  { id: "summer-table", theme: "夏の食卓にライチを出すという提案", slugBase: "lychee-summer-table", category: "楽しみ方・レシピ", pillar: "/lychee/recipes" },
  { id: "seed-question", theme: "ライチの種のこと。食べるときの細かい疑問に答える", slugBase: "lychee-seed-questions", category: "楽しみ方・レシピ", pillar: "/lychee/how-to-eat" },
  { id: "taste-words", theme: "ライチの味を、人に伝えるならどう言葉にする？", slugBase: "describing-lychee-taste", category: "楽しみ方・レシピ", pillar: "/lychee/taste" },
  { id: "water-content", theme: "水分の多い果物としてのライチ", slugBase: "lychee-water-content", category: "楽しみ方・レシピ", pillar: "/lychee/nutrition" },
  { id: "fruit-in-daily-life", theme: "夏の暮らしに果物を取り入れるという考え方", slugBase: "summer-fruit-in-daily-life", category: "楽しみ方・レシピ", pillar: "/lychee/nutrition" },

  /* ---- 贈り物のヒント ---- */
  { id: "gift-summer", theme: "夏のフルーツギフトに、ライチという選択肢", slugBase: "lychee-summer-fruit-gift", category: "贈り物のヒント", pillar: "/lychee/gift" },
  { id: "gift-notes", theme: "ライチを贈るとき、先方に伝えておきたいこと", slugBase: "lychee-gift-what-to-tell", category: "贈り物のヒント", pillar: "/lychee/gift" },
  { id: "gift-rare", theme: "珍しい果物を贈りたいときの選び方", slugBase: "rare-fruit-gift-choosing", category: "贈り物のヒント", pillar: "/lychee/gift" },
  { id: "kagoshima-fruit-gift", theme: "鹿児島県産のフルーツを贈るという選択", slugBase: "kagoshima-fruit-gift", category: "贈り物のヒント", pillar: "/lychee/kagoshima" },
  { id: "gift-for-family", theme: "実家や家族に季節の果物を送るとき", slugBase: "seasonal-fruit-for-family", category: "贈り物のヒント", pillar: "/lychee/gift" },

  /* ---- 鹿児島・指宿のこと ---- */
  { id: "ibusuki-climate", theme: "指宿の気候と、果物づくりの関係", slugBase: "ibusuki-climate-and-fruit", category: "鹿児島・指宿のこと", pillar: "/lychee/ibusuki" },
  { id: "kagoshima-tropical", theme: "鹿児島で南国のフルーツが育つということ", slugBase: "kagoshima-tropical-fruit", category: "鹿児島・指宿のこと", pillar: "/lychee/kagoshima" },
  { id: "satsuma-south-end", theme: "薩摩半島の南端・山川という場所", slugBase: "yamakawa-satsuma-south-end", category: "鹿児島・指宿のこと", pillar: "/lychee/ibusuki" },
  { id: "kagoshima-summer-fruit", theme: "鹿児島の夏に穫れる果物のこと", slugBase: "kagoshima-summer-fruits", category: "鹿児島・指宿のこと", pillar: "/lychee/kagoshima" },
  { id: "warm-climate-farming", theme: "温暖な気候が果樹栽培にもたらすもの", slugBase: "warm-climate-fruit-farming", category: "鹿児島・指宿のこと", pillar: "/lychee/ibusuki" },

  /* ---- 農園とライチづくり ---- */
  { id: "lychee-tree", theme: "ライチはどんな木に、どんなふうに実るのか", slugBase: "how-lychee-grows", category: "農園とライチづくり", pillar: "/lychee" },
  { id: "harvest-work", theme: "ライチの収穫は、どのように行われるのか", slugBase: "lychee-harvest-work", category: "農園とライチづくり", pillar: "/lychee/season" },
  { id: "house-cultivation", theme: "ハウスで熱帯の果樹を育てるということ", slugBase: "greenhouse-tropical-fruit", category: "農園とライチづくり", pillar: "/lychee/kagoshima" },
  { id: "variety-exists", theme: "ライチに品種があるということ", slugBase: "lychee-varieties-exist", category: "農園とライチづくり", pillar: "/lychee/season" },
  { id: "farm-direct-meaning", theme: "農園から直接届くということの意味", slugBase: "farm-direct-meaning", category: "農園とライチづくり", pillar: "/lychee/domestic" },
  { id: "short-season-farming", theme: "旬の短い果物をつくるということ", slugBase: "short-season-fruit-farming", category: "農園とライチづくり", pillar: "/lychee/season" },
  { id: "imported-vs-domestic-state", theme: "輸入と国産で、届く状態がどう違うのか", slugBase: "imported-vs-domestic-lychee-state", category: "農園とライチづくり", pillar: "/lychee/domestic" },
];

/* ================================================================
   ユーティリティ
================================================================ */

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stamp(): string {
  return today().replace(/-/g, "");
}

/** 既存記事の topicId → 最終掲載日 */
function existingTopics(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(BLOG_DIR)) return map;
  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (!file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
    const id = String(data.topicId ?? "");
    const date = String(data.date ?? "");
    if (id && (!map.has(id) || date > (map.get(id) ?? ""))) map.set(id, date);
  }
  return map;
}

/** 未使用テーマを優先。すべて書き終えたら、最も古いテーマを別の切り口で書き直す */
function pickTopic(): { topic: Topic; fresh: boolean } {
  const used = existingTopics();
  const unused = TOPICS.filter((topic) => !used.has(topic.id));

  if (unused.length > 0) {
    // 既存記事数でインデックスを進め、カテゴリーの偏りを避ける
    const index = used.size % unused.length;
    return { topic: unused[index], fresh: true };
  }

  const sorted = [...TOPICS].sort((a, b) =>
    (used.get(a.id) ?? "").localeCompare(used.get(b.id) ?? ""),
  );
  return { topic: sorted[0], fresh: false };
}

function uniqueSlug(base: string): string {
  if (!fs.existsSync(path.join(BLOG_DIR, `${base}.md`))) return base;
  return `${base}-${stamp()}`;
}

/** モデル出力からJSONを取り出す（```フェンス等を除去） */
function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

/** 本文の軽い整形（誤って入ったfrontmatter・H1・コードフェンスを除去） */
function cleanBody(body: string): string {
  let b = body.trim();
  b = b.replace(/^---[\s\S]*?---\s*/, "");
  b = b.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```\s*$/i, "");
  b = b.replace(/^#\s+.*$/m, "").trim(); // H1はtitleが担う
  return b;
}

/**
 * 書いてはいけない表現が混ざっていないかの最終チェック。
 * 見つかったら記事を保存せずに落とす（誤情報を公開しないため）。
 */
const BANNED = [
  { word: "日本一", why: "根拠のない最上級表現" },
  { word: "No.1", why: "根拠のない最上級表現" },
  { word: "ナンバーワン", why: "根拠のない最上級表現" },
  { word: "最安", why: "根拠のない最上級表現" },
  { word: "最高級", why: "根拠のない最上級表現" },
  { word: "必ず買える", why: "在庫を断定する表現" },
  { word: "病気が治", why: "医療効果の断定" },
  { word: "治ります", why: "医療効果の断定" },
  { word: "免疫力が上が", why: "医療効果の断定" },
  { word: "美容効果", why: "効果の断定" },
  { word: "健康になれ", why: "効果の断定" },
  { word: "痩せ", why: "効果の断定" },
  { word: "ダイエット効果", why: "効果の断定" },
  { word: "のし", why: "未対応のサービス（対応していないため言及させない）" },
  { word: "熨斗", why: "未対応のサービス" },
];

/** 販売していない期間だけ追加で禁止する表現 */
const CLOSED_SEASON_BANNED = [
  { word: "ご注文いただけます", why: "今季は販売を終了しているため" },
  { word: "ご購入いただけます", why: "今季は販売を終了しているため" },
  { word: "お買い求めいただけます", why: "今季は販売を終了しているため" },
  { word: "販売中です", why: "今季は販売を終了しているため" },
  { word: "販売しています", why: "今季は販売を終了しているため" },
  { word: "今すぐご注文", why: "今季は販売を終了しているため" },
];

function findBanned(text: string): Array<{ word: string; why: string }> {
  const rules = IS_SELLING ? BANNED : [...BANNED, ...CLOSED_SEASON_BANNED];
  return rules.filter((rule) => text.includes(rule.word));
}

/* ================================================================
   メイン
================================================================ */

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ERROR: ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const { topic, fresh } = pickTopic();
  const date = today();
  const slug = uniqueSlug(topic.slugBase);
  const pillar = PILLAR_PAGES.find((p) => p.url === topic.pillar);

  console.log("──────────────────────────────────────────────");
  console.log(`使用モデル (model)    : ${MODEL}`);
  console.log(`テーマ    (topic)     : ${topic.theme}`);
  console.log(`カテゴリ  (category)  : ${topic.category}`);
  console.log(`支える柱  (pillar)    : ${topic.pillar}`);
  console.log(`slug                  : ${slug}`);
  console.log(`再執筆(全消化後)      : ${fresh ? "no" : "yes"}`);
  console.log("──────────────────────────────────────────────");

  const shopList = SHOP_LINKS.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  const pillarList = PILLAR_PAGES.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  const factList = FACTS.map((f) => `- ${f}`).join("\n");

  const system = [
    `あなたは、${SITE.area}でライチを育てている農園「${SITE.name}」のWebサイトの書き手です。`,
    `${SITE.name}は${SITE.business}を行っています。代表は${SITE.owner}、所在地は${SITE.address}です。`,
    "読者は、ライチを食べたことがない方や、国産の生ライチをお取り寄せしようか迷っている方です。",
    "農園の人が、畑のことばで丁寧に説明しているような文章を書きます。次のルールを厳守してください。",
    "",
    "【文章のきまり】",
    "- 日本語で執筆する",
    "- 本文（frontmatterを除く）は2,000〜3,000文字程度",
    "- 見出しは ## (H2) と ### (H3) で構成し、H1(#)は使わない",
    "- 冒頭に導入文、中盤に本文、最後に「まとめ」を置く",
    "- 導入文では、記事の問いに対する答えを先に短く示す（前置きを長く書かない）",
    "- 一文は短く。読点でつなぎすぎない",
    "- 「鹿児島」「指宿」「山川」「国産ライチ」「生ライチ」を自然に含める（詰め込みは禁止）",
    "- AIにありがちな定型句を使わない。禁止例:「いかがでしたか」「〜について徹底解説します」「ぜひ最後までご覧ください」「今回は〜をご紹介します」",
    "",
    "【書いてはいけないこと】",
    "- 「日本一」「No.1」「最安」「最高級」など根拠のない最上級・誇張表現",
    "- 「必ず買える」など在庫や入荷を断定する表現",
    "- 価格・送料・発送日・収穫量・販売開始日を、下の事実にない形で断定すること",
    "- 糖度や果実の大きさの数値を勝手に書くこと（測定値を持っていないため）",
    "- 栄養について医療的な効果を断定すること。禁止例:「病気が治る」「免疫力が上がる」「美容効果がある」「健康になれる」「ダイエットできる」",
    "  栄養に触れる場合は、一般的な食品情報として「〇〇が含まれています」程度にとどめる",
    "- のし・ギフト包装・メッセージカードに触れること（対応していないため）",
    "- 他の農園や他社を批判すること",
    "- アレルギーや体質の話を断定すること。触れる場合は「気になる方は専門家にご相談ください」と添える",
    ...(IS_SELLING
      ? []
      : [
          "- いま注文できるかのように書くこと。今季の販売は終了しています。",
          "  「ご注文いただけます」「お買い求めいただけます」「販売中です」とは書かない",
          "  商品ページに触れるときは「次の収穫は来年の初夏です」と添える",
        ]),
    "",
    "【事実の土台（これ以外の事実を作らない）】",
    factList,
    "",
    "【この記事の役割（キーワードのすみ分け・重要）】",
    "このサイトには、ライチの総合的な解説を担当する「ライチ完全ガイド」（/lychee 配下）が別にあります。",
    "この記事はその“支援記事”です。次を厳守してください。",
    "- 与えられたテーマの具体的な疑問だけに絞って答える。ライチの総合解説にしない",
    "- 「ライチの栄養」「ライチの食べ方」「ライチの旬」「ライチの保存方法」「生ライチとは」といった",
    "  総合テーマを記事の主題にしない（それらはガイドが担当している）",
    "- それらに関連して触れる必要があるときは、深入りせず1〜2文で済ませ、該当するガイドへリンクする",
    "- タイトルにも、ガイドが担当する総合テーマをそのまま使わない",
    "",
    "【内部リンク】",
    "- 本文中に、文脈に合う内部リンクを3〜5個、Markdownリンク（[表示テキスト](URL)）で自然に挿入する",
    "- アンカーテキストは内容が分かる具体的な文言にする。「こちら」「詳しくはこちら」は使わない",
    `- 指定された“支える柱”のページ（${topic.pillar}）へのリンクは必ず1つ入れる`,
    "- 商品・購入ページへのリンクを1つは入れる。ただし記事全体を宣伝文にしない",
  ].join("\n");

  const user = [
    `今日の記事テーマ：「${topic.theme}」`,
    `この記事が支える柱のページ：${pillar ? `${pillar.label}（${pillar.url}）` : topic.pillar}`,
    fresh
      ? ""
      : "※このテーマは過去に一度書いています。前回とは異なる切り口・見出し構成で、新しい観点から書き直してください。",
    "",
    "利用できる内部リンク①：商品・購入まわり（文脈に合うものだけ使う）",
    shopList,
    "",
    "利用できる内部リンク②：ライチ完全ガイド（“支える柱”は必ず使う。ほかに関連するものがあれば1つ追加してよい）",
    pillarList,
    "",
    "次のJSON形式**のみ**を出力してください（前後に説明やコードフェンスを付けない）：",
    "{",
    '  "title": "30文字前後の記事タイトル（キーワードを自然に含む・煽らない）",',
    '  "description": "110〜130文字のメタディスクリプション",',
    '  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"],',
    '  "body": "Markdown本文（frontmatterやH1は含めない。## と ### の見出し、導入・本文・まとめ、内部リンクを含む2000〜3000字）"',
    "}",
  ].join("\n");

  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.7,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = res.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  let parsed: {
    title: string;
    description: string;
    tags: string[];
    body: string;
  };
  try {
    parsed = JSON.parse(extractJson(text));
  } catch (error) {
    console.error("ERROR: モデル出力のJSON解析に失敗しました。");
    console.error(text.slice(0, 800));
    throw error;
  }

  const title = String(parsed.title ?? "").trim();
  const description = String(parsed.description ?? "").trim();
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 6)
    : [];
  const body = cleanBody(String(parsed.body ?? ""));

  if (!title || body.length < 500) {
    throw new Error(
      `生成結果が不十分です（title: ${title ? "有" : "無"} / 本文長: ${body.length}）`,
    );
  }

  // 禁止表現チェック。1つでも見つかったら保存せずに失敗させる
  const violations = findBanned(`${title}\n${description}\n${body}`);
  if (violations.length > 0) {
    console.error("ERROR: 使ってはいけない表現が含まれていたため保存しません。");
    for (const v of violations) console.error(`  - 「${v.word}」: ${v.why}`);
    process.exit(1);
  }

  const fileContent = matter.stringify(`\n${body}\n`, {
    title,
    slug,
    description,
    date,
    updatedAt: date,
    category: topic.category,
    tags,
    topicId: topic.id,
    pillar: topic.pillar,
  });

  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), fileContent, "utf-8");

  const bodyChars = body.replace(/\s/g, "").length;
  console.log("✓ 生成完了");
  console.log(`  ファイル   (file)   : content/blog/${slug}.md`);
  console.log(`  タイトル   (title)  : ${title}`);
  console.log(`  本文文字数 (chars)  : 約 ${bodyChars} 文字`);
  console.log(`  使用モデル (model)  : ${MODEL}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
