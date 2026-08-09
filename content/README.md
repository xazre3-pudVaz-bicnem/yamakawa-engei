# content/

サイトの記事データを置く場所です。

## content/blog/

ブログ記事（Markdown）。**Claude API + GitHub Actions で毎日1記事が自動生成され、
このフォルダに追加されます。**

- 生成スクリプト: `scripts/generate-daily-post.ts`
- 実行スケジュール: `.github/workflows/daily-blog.yml`（毎日12:00 JST）
- 読み込み: `src/lib/blog.ts`
- 表示: `/blog`、`/blog/[slug]`、`/blog/category/[category]`

### frontmatter

```yaml
---
title: 記事タイトル
slug: article-slug          # 英数字とハイフンのみ
description: メタディスクリプション（110〜130文字）
date: 2026-08-09            # 公開日
updatedAt: 2026-08-09       # 更新日（sitemapのlastModifiedに使う）
category: ライチを買う前に    # src/lib/blog.ts の BLOG_CATEGORIES から
tags: [タグ1, タグ2]
topicId: first-time-guide   # 生成スクリプトの重複回避に使う
pillar: /lychee             # この記事が支えるガイドページ
---
```

### 手で記事を追加・修正するとき

このフォルダに `.md` を置けば、そのまま記事として表示されます。
自動生成された記事を直す場合も、ファイルを編集してコミットするだけです。

ただし次の点にご注意ください。

- `slug` はファイル名と合わせてください（URLになります）
- `category` は `src/lib/blog.ts` の `BLOG_CATEGORIES` にある名前だけが有効です
- `topicId` を消すと、同じテーマの記事がもう一度生成されることがあります

### 書いてはいけないこと

生成スクリプトにチェックを入れていますが、手で書くときも同じです。

- 「日本一」「No.1」「最安」「最高級」などの根拠のない表現
- 「必ず買える」など在庫を断定する表現
- 価格・送料・発送日・収穫量を、サイトの表記と違う形で書くこと
- 糖度や果実の大きさの数値（測定値を持っていないため）
- 栄養についての医療的な効果の断定
- のし・ギフト包装への言及（対応していないため）

### ライチ完全ガイドとのすみ分け

ライチの総合的な解説（栄養・食べ方・旬・保存・生ライチ・産地）は
`/lychee` 配下のガイドが担当します。
ブログはその**支援記事**で、より細かい疑問に答えてガイドと商品へ送客します。

同じ検索意図の記事を作ると共倒れになるため、
テーマを足すときは必ず `src/data/lycheeGuide.ts` の `intent` 欄を確認してください。
