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
    // [確認済] 山川園芸のお届け時期は7月上旬からお盆ごろ。
    answer:
      "山川園芸のライチをお届けできるのは、7月上旬からお盆ごろまでです。旬がとても短く、1年のうち限られた期間しか生の実に出会えません。その年の天候によって、時期は前後します。",
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
    link: { href: "/lychee/how-to-eat", label: "ライチの食べ方" },
  },
  {
    id: "storage",
    category: "lychee",
    question: "届いたらどう保存しますか？何日くらいもちますか？",
    // [公式] 商品ページの保存方法の記載にもとづく
    answer:
      "冷蔵庫で保存し、約1週間を目安にお召し上がりください。乾燥すると果皮の色が変わりやすいので、ジッパー付きの袋などに入れて冷蔵庫へ入れてください。食べきれない分は、皮つきのまま冷凍しておくこともできます。",
    link: { href: "/lychee/how-to-eat", label: "保存方法" },
  },
  {
    id: "chill",
    category: "lychee",
    question: "食べる前に冷やしたほうがいいですか？",
    answer:
      "冷蔵庫でしっかり冷やしてからのほうが、みずみずしさを感じやすくなります。お召し上がりになる少し前に冷蔵庫から出す、という手間は要りません。",
    link: { href: "/lychee/how-to-eat", label: "おいしい食べ方" },
  },
  {
    id: "variety",
    category: "lychee",
    question: "品種は何ですか？",
    // [確認済] 収穫の時期で品種が変わる。品種指定での販売はしていない。
    answer:
      "収穫の時期によって変わります。7月ごろは三月紅と在来種（佐多、黒葉）、8月ごろは宮崎ライチと呼ばれる種、桂味、ノーマイチーです。品種を指定してのご購入はお受けしておらず、その時期に採れたもののなかから、いちばん良い状態のものをお届けしています。",
    link: { href: "/lychee", label: "ライチについて" },
  },

  /* ---- ご注文・お支払い ---- */
  {
    id: "payment",
    category: "order",
    question: "支払い方法は何がありますか？",
    // Stripeで有効化している手段のみ。増やしたら checkoutConfig.paymentMethods も更新すること。
    answer:
      "クレジットカード（VISA／Mastercard／JCB／American Express など）をご利用いただけます。山川園芸のサイト内でそのままお支払いいただけます。カード情報は決済代行会社が直接お預かりし、当園のサーバーには保存されません。",
    link: { href: "/guide", label: "お買い物ガイド" },
  },
  {
    id: "shipping-fee",
    category: "order",
    question: "送料はいくらですか？",
    // [確認済] クール宅急便60サイズ・鹿児島発。地域別の金額は src/data/shipping.ts。
    answer:
      "お届け先の地域によって変わります。すべて60サイズのクール宅急便でお送りし、送料は個口数の分だけいただきます。地域別の金額は配送・送料についてのページに掲載しています。ご購入手続きの画面でお届け先をご入力いただくと、送料を含めた合計金額が表示されます。",
    link: { href: "/shipping", label: "配送・送料について" },
  },
  {
    id: "parcel-count",
    category: "order",
    question: "まとめて買うと送料は何個口分かかりますか？",
    // [確認済] 350gは3点まで、500gは2点まで1個口。組み合わせでも1個口に収まる場合がある。
    answer:
      "1個口に入るのは、350gなら3点まで、500gなら2点までが目安です。500g×1点と350g×2点のように、組み合わせても1個口に収まる場合があります。入りきらない分は個口数が増え、その分の送料がかかります。カートの画面で個口数をご確認いただけます。",
    link: { href: "/shipping", label: "配送・送料について" },
  },
  {
    id: "gift",
    category: "order",
    question: "贈り物にできますか？のし・ギフト包装はできますか？",
    // [確認済] のし・ギフト包装は非対応。包装はジッパー袋／店頭販売と同じ包装に対応。
    answer:
      "お届け先をご指定いただければ、贈り物としてお送りいただけます。ただし、のし・ギフト包装・メッセージカードには対応しておりません。包装は、ジッパー付きの袋のほか、店頭販売と同じ包装にも対応しています。ご希望がありましたら、ご注文の際にお知らせください。",
    link: { href: "/shop", label: "オンラインショップ" },
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
    answer:
      "生鮮食品のため、商品に欠陥がある場合を除き、原則として返品・交換はお受けしておりません。お届けした商品に問題があった場合は、お早めにご連絡ください。",
    link: { href: "/legal", label: "特定商取引法に基づく表記" },
  },

  /* ---- 配送・お届け ---- */
  {
    id: "dispatch",
    category: "shipping",
    question: "いつごろ発送されますか？",
    answer:
      "ご注文から2〜3営業日以内に発送いたします。収穫の状況や天候によって前後する場合があります。",
    link: { href: "/shipping", label: "配送・送料について" },
  },
  {
    id: "delivery-date",
    category: "shipping",
    question: "お届け日は指定できますか？",
    // 可否そのものは未確定のため、ご相談いただく案内にとどめている。
    answer:
      "ご希望のある方は、ご注文前にご相談ください。収穫の状況に合わせて発送しているため、ご希望に添えない場合もあります。",
    link: { href: "/contact", label: "お問い合わせ" },
  },
  {
    id: "delivery-area",
    category: "shipping",
    question: "全国どこでも届きますか？離島にも送れますか？",
    // [確認済] 離島を除く全国。ヤマト運輸のクール便のみ。
    answer:
      "離島を除く全国へお届けしています。ヤマト運輸のクール便でお送りします。",
    link: { href: "/shipping", label: "配送・送料について" },
  },

  /* ---- 農園について ---- */
  {
    id: "visit",
    category: "farm",
    question: "農園で直接購入できますか？見学はできますか？",
    // [確認済] 事前連絡があれば対応。ライチ狩りの可否は未確定。
    answer:
      "直売・見学は、事前にご連絡いただければ対応しています。ライチ狩りができるかどうかは時期によって変わりますので、あわせてお問い合わせください。",
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
