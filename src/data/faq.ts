/**
 * よくある質問
 *
 * ─────────────────────────────────────────────
 * 記載ルール（重要）
 * ─────────────────────────────────────────────
 * answer が null の質問は「未確認」を意味する。
 *   - 画面には質問だけを出し、回答欄には問い合わせ導線を表示する
 *   - FAQPage 構造化データからは除外される
 * 推測で回答を書かないこと。確認が取れたら answer に文章を入れるだけで、
 * 表示と構造化データの両方に反映される。
 *
 * 出典の凡例
 *   [公式] 公式オンラインショップ（BASE）の掲載内容
 *   [一般] ライチという果物についての一般的な情報
 *   [確認済] ご本人から提供された情報
 *   [TODO] 未確認
 */

export type FaqCategoryId = "lychee" | "order" | "shipping" | "farm";

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  /** 未確認なら null */
  answer: string | null;
  /** 詳しい説明ページへのリンク */
  link?: { href: string; label: string };
};

export const faqCategories: Array<{ id: FaqCategoryId; name: string }> = [
  { id: "lychee", name: "ライチについて" },
  { id: "order", name: "ご注文・お支払い" },
  { id: "shipping", name: "配送・お届け" },
  { id: "farm", name: "農園について" },
];

export const faqs: FaqItem[] = [
  /* ---- ライチについて ---- */
  {
    id: "season",
    category: "lychee",
    question: "ライチの旬はいつですか？",
    // [一般] 国内産のライチは6月下旬から7月ごろに収穫期を迎える。
    answer:
      "国内で育つライチは、6月下旬から7月ごろが収穫の時期です。旬がとても短く、1年のうち限られた期間しか生の実に出会えません。山川園芸でも、その年の天候によって収穫のタイミングは前後します。",
    link: { href: "/lychee", label: "ライチについて" },
  },
  {
    id: "what-is-fresh",
    category: "lychee",
    question: "「生ライチ」とは何ですか？冷凍のものと何が違いますか？",
    // [一般] 冷凍と生の差は主に香りと食感。断定的な糖度・品質比較はしない。
    answer:
      "スーパーでよく見かけるライチの多くは冷凍されたものです。生ライチは、木で色づいた実を収穫してそのままお届けするもの。皮をむいたときに香りが立ちのぼること、果汁のみずみずしさが、生ならではの持ち味です。",
    link: { href: "/lychee", label: "生ライチと冷凍ライチの違い" },
  },
  {
    id: "how-to-eat",
    category: "lychee",
    question: "どうやって食べますか？皮はむきにくいですか？",
    answer:
      "包丁は要りません。ヘタのついていた側から爪を入れると、皮に切れ目が入ります。あとはみかんのように指でむくだけ。中には種があるので、種を避けながらお召し上がりください。",
    link: { href: "/how-to-eat", label: "ライチの食べ方" },
  },
  {
    id: "storage",
    category: "lychee",
    question: "届いたらどう保存しますか？何日くらいもちますか？",
    // [公式] 商品ページの保存方法の記載にもとづく
    answer:
      "冷蔵庫で保存し、約1週間を目安にお召し上がりください。乾燥すると果皮の色が変わりやすいので、ジッパー付きの袋などに入れて冷蔵庫へ入れてください。食べきれない分は、皮つきのまま冷凍しておくこともできます。",
    link: { href: "/how-to-eat", label: "保存方法" },
  },
  {
    id: "chill",
    category: "lychee",
    question: "食べる前に冷やしたほうがいいですか？",
    answer:
      "冷蔵庫でしっかり冷やしてからのほうが、みずみずしさを感じやすくなります。お召し上がりになる少し前に冷蔵庫から出す、という手間は要りません。",
    link: { href: "/how-to-eat", label: "おいしい食べ方" },
  },
  {
    id: "variety",
    category: "lychee",
    question: "品種は何ですか？",
    // [TODO] 品種は未確認。推測で書かないこと。
    answer: null,
  },

  /* ---- ご注文・お支払い ---- */
  {
    id: "payment",
    category: "order",
    question: "支払い方法は何がありますか？",
    // [公式] BASEの特定商取引法に基づく表記にもとづく
    answer:
      "クレジットカード、PAY ID あと払い（コンビニ・銀行）、銀行振込をご利用いただけます。ご注文手続きの画面でお選びください。",
    link: { href: "/guide", label: "お買い物ガイド" },
  },
  {
    id: "shipping-fee",
    category: "order",
    question: "送料はいくらですか？",
    // [TODO] 送料は未確定。確定したら siteConfig の shippingConfig に入力し、
    // ここにも文章を書く（両方が同じ情報を指すよう注意）。
    answer: null,
    link: { href: "/shipping", label: "配送・送料について" },
  },
  {
    id: "gift",
    category: "order",
    question: "贈り物にできますか？のし・ギフト包装はできますか？",
    // [TODO] ギフト包装・のしの対応可否は未確認。「できます」と書かないこと。
    answer: null,
    link: { href: "/contact", label: "お問い合わせ" },
  },
  {
    id: "restock",
    category: "order",
    question: "売り切れた場合、再入荷はありますか？",
    answer:
      "ライチは収穫できる期間が限られているため、今季分が終わりしだい販売を終了します。次の収穫は翌年の初夏です。販売の再開は公式Instagramと本サイトのお知らせでご案内します。",
    link: { href: "/news", label: "お知らせ" },
  },
  {
    id: "cancel",
    category: "order",
    question: "注文後のキャンセルや返品はできますか？",
    // [公式] BASEの特定商取引法に基づく表記にもとづく
    answer:
      "生鮮食品のため、商品に欠陥がある場合を除き、原則として返品・交換はお受けしておりません。お届けした商品に問題があった場合は、お早めにご連絡ください。",
    link: { href: "/legal", label: "特定商取引法に基づく表記" },
  },

  /* ---- 配送・お届け ---- */
  {
    id: "dispatch",
    category: "shipping",
    question: "いつごろ発送されますか？",
    // [公式] 商品ページ・特商法表記の両方にもとづく
    answer:
      "ご入金の確認後、5日以内に発送いたします（目安はご注文から2〜3営業日）。収穫の状況や天候によって前後する場合があります。",
    link: { href: "/shipping", label: "配送・送料について" },
  },
  {
    id: "delivery-date",
    category: "shipping",
    question: "お届け日は指定できますか？",
    // [TODO] 日時指定の可否は未確認
    answer: null,
    link: { href: "/contact", label: "お問い合わせ" },
  },
  {
    id: "delivery-area",
    category: "shipping",
    question: "全国どこでも届きますか？離島にも送れますか？",
    // [TODO] 配送可能地域・離島の可否は未確認
    answer: null,
    link: { href: "/contact", label: "お問い合わせ" },
  },

  /* ---- 農園について ---- */
  {
    id: "visit",
    category: "farm",
    question: "農園で直接購入できますか？見学はできますか？",
    // [TODO] 直売・見学の可否は未確認。電話での確認導線のみ案内する。
    answer: null,
    link: { href: "/access", label: "農園・アクセス" },
  },
  {
    id: "store",
    category: "farm",
    question: "お店で買えるところはありますか？",
    // [公式] 公式Instagramのプロフィール記載にもとづく
    answer:
      "南さつま市のPICO様の青果コーナーにてお取り扱いいただいています。時期によって取り扱い状況が変わるため、最新の情報は公式Instagramをご確認ください。",
  },
  {
    id: "other-fruits",
    category: "farm",
    question: "ライチ以外にも育てていますか？",
    // [公式] ショップ紹介文「ライチをはじめ、様々な熱帯性の果樹を販売しております」
    answer:
      "ライチのほかにも、さまざまな熱帯性の果樹を育てています。苗木のお取り扱いもあります。時期によって内容が変わるため、公式Instagramでご覧ください。",
    link: { href: "/about", label: "山川園芸について" },
  },
];

/** 回答が確定しているFAQ（構造化データに使う） */
export const answeredFaqs = faqs.filter(
  (faq): faq is FaqItem & { answer: string } => Boolean(faq.answer),
);

/** カテゴリー内のFAQ */
export function getFaqsByCategory(category: FaqCategoryId): FaqItem[] {
  return faqs.filter((faq) => faq.category === category);
}

/** TOPページに出す代表的なFAQ（回答が確定しているものだけ） */
export const featuredFaqIds = [
  "season",
  "what-is-fresh",
  "how-to-eat",
  "storage",
  "dispatch",
  "restock",
];

export const featuredFaqs = answeredFaqs.filter((faq) =>
  featuredFaqIds.includes(faq.id),
);
