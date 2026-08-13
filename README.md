# 山川園芸 公式ECサイト

鹿児島県指宿市山川のライチ農園「山川園芸」のオンラインショップ兼ブランドサイト。

- Next.js 16（App Router）／ TypeScript ／ Tailwind CSS v4
- ホスティング想定：Vercel

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 本番ビルド
npm run lint       # ESLint
npm run typecheck  # 型チェック
```

---

## いちばんよく触るファイル

| やりたいこと | 開くファイル |
| --- | --- |
| ブログ記事のテーマを追加・修正する | `scripts/generate-daily-post.ts` の `TOPICS` |
| ライチ解説ページを追加・修正する | `src/data/lycheeGuide.ts` ＋ `src/app/lychee/<slug>/page.tsx` |
| 栄養の数値を更新する | `src/data/nutrition.ts`（出典の確認が必須） |
| 販売状況を変える（販売中／予約受付中／近日開始／販売終了） | `src/data/siteConfig.ts` の `salesStatus.phase` |
| 商品を追加・変更する（価格・在庫・内容量） | `src/data/products.ts` |
| 送料を設定する | `src/data/siteConfig.ts` の `shippingConfig` |
| 決済の方式を切り替える | `src/data/siteConfig.ts` の `checkoutConfig.provider` |
| よくある質問を追加・回答する | `src/data/faq.ts` |
| お知らせを出す | `src/data/news.ts` |
| 農園のストーリーを書く | `src/data/story.ts` |
| コラム記事を追加する | `src/data/column.ts` |
| 写真を差し替える | `public/images/`（→ `public/images/README.md`） |

JSXに商品や文章を直接書かず、必ずデータ側を更新してください。
一覧・詳細・構造化データ・sitemap・商品フィードがすべて同時に更新されます。

---

## 公開前のチェック

- 本番ドメイン `https://yamakawaengei.com` を Vercel のプロジェクトに接続する
- 接続後、`https://yamakawaengei.com/sitemap.xml` を
  Google Search Console に登録する
- Vercel の環境変数は必須のものはありません
  （Stripe を接続するときだけ `.env.example` を参照）

---

## 「確認中」の仕組み

このサイトは、**確認できていないことを画面に出さない** ように作ってあります。

- データが `null` の項目は、画面から自動的に消えるか「確認中」と表示されます
- 構造化データ（JSON-LD）にも出力されません
- 未確認のFAQは、回答のかわりに問い合わせ導線が出ます

推測で値を埋めないでください。確認が取れたら `null` を実際の値に
置き換えるだけで、関係するページがすべて正しくなります。

---

## 販売状況の切り替え

`src/data/siteConfig.ts`：

```ts
export const salesStatus = {
  phase: "coming_soon",  // ← ここだけ書き換える
  ...
};
```

| 値 | 表示 |
| --- | --- |
| `"on_sale"` | 販売中 |
| `"preorder"` | 予約受付中 |
| `"coming_soon"` | 近日販売開始 |
| `"closed"` | 今季販売終了 |

ヒーローのCTA、TOPのお知らせ帯、ショップページの案内、
スマホ下部の購入バーの文言が、これ1箇所で切り替わります。

商品ごとの在庫は `src/data/products.ts` の `availability` で別に管理します
（`in_stock` / `preorder` / `sold_out` / `coming_soon` / `draft`）。
`sold_out` と `coming_soon` の商品はカートに入れられません。

---

## 決済（Stripe Embedded Checkout）

お客様は**山川園芸のサイトから出ることなく**、住所とカード情報を入力して
決済まで完了できます。外部のショップへは遷移しません。

```text
商品ページ → カート → /checkout（住所＋カード入力）→ /order/complete
```

| ファイル | 役割 |
| --- | --- |
| `src/data/shipping.ts` | **送料の設定（ここを設定しないと決済できません）** |
| `src/lib/stripe.ts` | Stripeクライアント（サーバー専用） |
| `src/lib/order.ts` | 注文内容の検証（価格はここでサーバー側から引き直す） |
| `src/app/api/checkout/route.ts` | Checkout Session の作成 |
| `src/app/api/stripe/webhook/route.ts` | 注文確定の正式な受け口 |
| `src/components/cart/StripeCheckout.tsx` | 決済フォームの描画 |
| `src/app/order/complete/page.tsx` | 注文完了ページ |

### 価格の改ざんができない仕組み

ブラウザから受け取るのは**商品のslugと数量だけ**です。
価格・商品名・合計金額はすべて `src/data/products.ts` から引き直します
（`src/lib/order.ts`）。開発者ツールで価格を書き換えても、
決済される金額は変わりません。

### 送料が未設定のあいだ

`src/data/shipping.ts` の `mode` が `"unconfirmed"` のあいだ、
決済画面は開かず「お電話でご注文ください」と案内します。
送料が決まっていない状態で注文を受けると赤字になるためです。

### 注文確定の判定

注文完了ページの表示ではなく、**Webhookを正式な判定**にしています。
お客様がブラウザを閉じても、支払いが済んでいれば通知が届きます。
署名検証と二重処理の防止を実装済みです。

注文の保存やメール通知を追加するときは、
`src/app/api/stripe/webhook/route.ts` の `handlePaidSession` に書いてください。
そのとき、二重処理の判定を `src/lib/webhook-events.ts`（メモリ上）から
保存先での判定に置き換えてください。

---

## カートと購入手続き

- カートの中身はブラウザの localStorage に保存され、ページを移動しても残ります
- 保存しているのは「商品のslugと数量」だけです。価格は毎回 `products.ts` から
  引き直すので、価格を変更すればカートの表示もすぐ新しくなります
- `checkoutConfig.provider` で購入手続きの挙動が変わります

| 値 | 動き |
| --- | --- |
| `"external"`（現在） | カート内容を確認後、公式オンラインショップ（BASE）へ引き継ぐ |
| `"stripe"` | `/api/checkout` 経由で Stripe Checkout へ |
| `"inquiry"` | お問い合わせフォームで注文を受ける |

### Stripeを接続する手順

1. `npm install stripe`
2. Vercel に `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` を設定
3. `src/app/api/checkout/route.ts` の「ここから」〜「ここまで」を実装
4. `checkoutConfig.provider` を `"stripe"` に変更
5. `shippingConfig` に送料を入力し、`shipping_options` に反映

金額は必ずサーバー側で `products.ts` から引き直します。
クライアントから送られた価格は使いません（改ざん防止）。

---

## SEO

- 本番ドメインは `https://yamakawaengei.com`。
  `src/data/siteConfig.ts` の `PRODUCTION_URL` 1行が canonical・OGP・sitemap・
  構造化データ・商品フィードのすべての基準になります
- sitemap.xml は商品とコラムを自動で拾います
- 構造化データ：`LocalBusiness`＋`Farm` / `WebSite` / `Product`＋`Offer` /
  `BreadcrumbList` / `FAQPage` / `Article` / `ItemList`
- 実在しないレビュー・評価は出力しません
- Googleショッピング用フィード：`/feed/products.xml`
  （価格と写真が揃った商品だけが載ります）

---

## ブログの自動投稿（`/blog`）

Claude API と GitHub Actions で、**毎日12:00（日本時間）に1記事**が自動生成され、
`content/blog/` に追加されて main へ直接コミットされます。
Vercel の GitHub 連携でそのまま公開されます。

| 項目 | 内容 |
| --- | --- |
| 実行時刻 | 毎日 12:00 JST（`cron: "0 3 * * *"`／UTC 03:00） |
| モデル | `claude-haiku-4-5-20251001`（コスト優先） |
| 保存先 | `content/blog/*.md` |
| 必要な設定 | GitHub Secrets に `ANTHROPIC_API_KEY` のみ |

### 準備（一度だけ）

1. GitHubリポジトリの Settings → Secrets and variables → Actions
2. **New repository secret** で `ANTHROPIC_API_KEY` を登録

これだけで動きます。手動で試すときは Actions タブ →
Daily Blog Post → Run workflow。

### モデルを変えたいとき

同じ画面の **Variables** タブで `ANTHROPIC_MODEL` を設定すると、そちらが優先されます。
未設定なら Haiku を使います。毎日の記事生成に Sonnet や Opus は使いません。
実行ログの先頭に、実際に使ったモデル名が出ます。

### 記事のテーマ

`scripts/generate-daily-post.ts` の `TOPICS` に約45件あります。
未使用のテーマから順に選ばれ、`topicId` で重複を避けます。
すべて書き終えると、最も古いテーマを別の切り口で書き直します。

**テーマを足すときは、必ず `src/data/lycheeGuide.ts` の `intent` 欄を確認してください。**
ブログはライチ完全ガイドの**支援記事**という位置づけで、
ガイドが担当する総合テーマ（栄養・食べ方・旬・保存など）は扱いません。
同じ検索意図の記事を作ると、ガイドとブログが共倒れになります。

各テーマには `pillar`（支えるガイドページ）を持たせてあり、
記事から必ずそのページへリンクが張られます。

### 安全装置

生成された記事に次の表現が含まれていた場合、**保存せずに失敗**します。

- 「日本一」「No.1」「最安」「最高級」などの根拠のない表現
- 「必ず買える」など在庫を断定する表現
- 医療効果の断定（「病気が治る」「免疫力が上がる」「美容効果」など）
- のし・熨斗（対応していないサービス）

事実の土台は `scripts/generate-daily-post.ts` の `FACTS` にまとめてあり、
価格・配送・品種・お届け時期をサイトの表記と揃えています。
**商品情報を変更したときは、`FACTS` も同時に更新してください。**

### 記事を手で直したいとき

`content/blog/` の `.md` を編集してコミットするだけです。
書き方は `content/README.md` に説明があります。

---

## ライチ完全ガイド（`/lychee`）

ライチについて調べる人を広く集め、山川園芸の生ライチにつなげるための
コンテンツクラスターです。**1キーワード＝1ページの薄い量産はしません。**
同じ検索意図のキーワードは1ページに統合しています。

| URL | 主な検索意図 |
| --- | --- |
| `/lychee` | ライチ（総合ハブ） |
| `/lychee/nutrition` | ライチ 栄養／カロリー／ビタミンC／葉酸／糖質 |
| `/lychee/how-to-eat` | ライチ 食べ方／皮 むき方／種 |
| `/lychee/season` | ライチ 旬／時期／収穫時期 |
| `/lychee/storage` | ライチ 保存方法／日持ち／冷蔵／冷凍 |
| `/lychee/fresh` | 生ライチ／生ライチとは |
| `/lychee/fresh-vs-frozen` | 生ライチ 冷凍 違い |
| `/lychee/domestic` | 国産ライチ／産地 |
| `/lychee/kagoshima` | 鹿児島 ライチ |
| `/lychee/ibusuki` | 指宿 ライチ／指宿 熱帯果樹 |
| `/lychee/how-to-choose` | ライチ 選び方／見分け方 |
| `/lychee/taste` | ライチ 味／食感 |
| `/lychee/gift` | ライチ ギフト／贈り物 |
| `/lychee/recipes` | ライチ 楽しみ方／デザート |

**ページを追加するとき**

1. `src/data/lycheeGuide.ts` に1件追加（title・description・キーワード・関連ページ）
2. `src/app/lychee/<slug>/page.tsx` を作り、`GuideLayout` で包んで本文だけ書く

パンくず・Article構造化データ・更新日・関連ページ・商品への導線・sitemapは
`GuideLayout` とデータ側が自動で面倒を見ます。

**追加する前に必ず** `lycheeGuide.ts` の `intent` 欄を確認してください。
同じ検索意図のページを増やすと共倒れになります（カニバリゼーション）。

**栄養ページの数値**は `src/data/nutrition.ts` にあり、
文部科学省 食品成分データベースからの転記です。
AIの記憶や一般ブログの数値を書かないでください。健康情報（YMYL）です。

---

ページごとの検索意図は重ならないよう分けています。

| ページ | 狙う検索意図 |
| --- | --- |
| `/` | 鹿児島 ライチ／指宿 ライチ |
| `/shop` `/products/*` | 生ライチ 通販／お取り寄せ／産地直送 |
| `/lychee/*` | ライチの知識（上の表） |
| `/about` `/access` | 山川園芸／指宿 ライチ農園 |
| `/column/*` | 農園の記録（今年の出来・収穫の様子） |

---

## ディレクトリ

```text
src/
  app/                      ページ（App Router）
    api/checkout/           Stripe Checkout Session の作成
    api/stripe/webhook/     注文確定の受け口
    checkout/               決済フォーム（Embedded Checkout）
    order/complete/         注文完了
    blog/                   ブログ（毎日自動生成）
    lychee/                 ライチ完全ガイド14ページ
    feed/                   Googleショッピング用フィード
  components/
    cart/                   カートと決済フォーム
    guide/                  ガイドの共通パーツ
    layout/                 Header / Footer / スマホ下部の購入バー
    product/                商品の見せ方
    sections/home/          TOPページの各セクション
    ui/                     共通パーツ
  data/                     ★ここを更新する
                            siteConfig / products / shipping / faq /
                            news / story / column / lycheeGuide / nutrition
  lib/                      Stripe・注文検証・構造化データ・metadata
content/blog/               ブログ記事（自動生成）
scripts/                    ブログ生成スクリプト
public/images/              写真（→ README.md に一覧）
```
