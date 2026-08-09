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

ページごとの検索意図は重ならないよう分けています。

| ページ | 狙う検索意図 |
| --- | --- |
| `/` | 鹿児島 ライチ／指宿 ライチ |
| `/shop` `/products/*` | 生ライチ 通販／お取り寄せ／産地直送 |
| `/lychee` | 生ライチとは／国産ライチ／冷凍との違い |
| `/how-to-eat` | ライチ 食べ方／皮のむき方／保存方法 |
| `/about` `/access` | 山川園芸／指宿 ライチ農園 |
| `/column/*` | 旬はいつ／ギフト／指宿の気候 |

---

## ディレクトリ

```
src/
  app/            ページ（App Router）
    api/checkout/ 決済APIの受け口（Stripe接続用）
    feed/         Googleショッピング用フィード
  components/
    cart/         カート一式
    layout/       Header / Footer / スマホ下部の購入バー
    product/      商品の見せ方
    sections/home/ TOPページの各セクション
    ui/           共通パーツ
  data/           ★ここを更新する（siteConfig / products / faq / news / story / column）
  lib/            構造化データ・metadata・小さな関数
public/images/    写真（→ README.md に一覧）
```
