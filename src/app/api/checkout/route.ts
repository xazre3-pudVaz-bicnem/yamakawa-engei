import { NextResponse } from "next/server";
import { getProduct, isBuyable } from "@/data/products";

/**
 * ご購入手続きAPI（Stripe接続用の受け口）
 *
 * ─────────────────────────────────────────────
 * 現在の状態
 * ─────────────────────────────────────────────
 * 決済サービスが未接続のため、注文内容の検証までを行い 501 を返す。
 * siteConfig の checkoutConfig.provider が "external" のあいだ、
 * 画面側からこのAPIは呼ばれない。
 *
 * ─────────────────────────────────────────────
 * Stripe を接続する手順
 * ─────────────────────────────────────────────
 * 1. `npm install stripe`
 * 2. 環境変数を設定する（.env.local / Vercel の Environment Variables）
 *      STRIPE_SECRET_KEY=sk_live_xxx        ← 絶対にコードへ書かない
 *      STRIPE_WEBHOOK_SECRET=whsec_xxx      ← 入金確定の受信に使う
 *      NEXT_PUBLIC_SITE_URL=https://...     ← 戻り先URLの組み立てに使う
 * 3. 下の「ここから」〜「ここまで」のコメントを実装に置き換える
 * 4. data/siteConfig.ts の checkoutConfig.provider を "stripe" にする
 * 5. 送料を shippingConfig に入力し、shipping_options に反映する
 *
 * ─────────────────────────────────────────────
 * 設計上の約束
 * ─────────────────────────────────────────────
 * 金額は必ずサーバー側で data/products.ts から引き直す。
 * クライアントから送られてきた価格は一切信用しない
 * （改ざんされた金額で決済されるのを防ぐため）。
 */

type RequestLine = { slug: string; quantity: number };

export async function POST(request: Request) {
  let body: { lines?: RequestLine[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "ご注文内容を読み取れませんでした。" },
      { status: 400 },
    );
  }

  const requestLines = Array.isArray(body.lines) ? body.lines : [];

  if (requestLines.length === 0) {
    return NextResponse.json(
      { message: "カートに商品が入っていません。" },
      { status: 400 },
    );
  }

  // ---- 商品データと突き合わせて検証する ----
  const validated: Array<{
    slug: string;
    name: string;
    unitPrice: number;
    quantity: number;
  }> = [];

  for (const line of requestLines) {
    const product = getProduct(String(line.slug));

    if (!product) {
      return NextResponse.json(
        { message: "お取り扱いのない商品が含まれています。" },
        { status: 400 },
      );
    }

    if (!isBuyable(product) || product.price === null) {
      return NextResponse.json(
        {
          message: `「${product.name}」はただいまご購入いただけません。`,
        },
        { status: 409 },
      );
    }

    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "数量が正しくありません。" },
        { status: 400 },
      );
    }

    validated.push({
      slug: product.slug,
      name: product.name,
      unitPrice: product.price, // ← サーバー側の価格のみを使う
      quantity: Math.min(product.maxQuantity, quantity),
    });
  }

  // ---- ここから: Stripe Checkout Session の作成 ----
  //
  // import Stripe from "stripe";
  //
  // const secretKey = process.env.STRIPE_SECRET_KEY;
  // if (!secretKey) { ... }
  //
  // const stripe = new Stripe(secretKey);
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   locale: "ja",
  //   line_items: validated.map((line) => ({
  //     quantity: line.quantity,
  //     price_data: {
  //       currency: "jpy",
  //       unit_amount: line.unitPrice, // 円は最小単位がそのまま整数
  //       product_data: { name: line.name },
  //     },
  //   })),
  //   // 送料が確定したら shippingConfig の値から組み立てる
  //   shipping_address_collection: { allowed_countries: ["JP"] },
  //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
  // });
  //
  // return NextResponse.json({ url: session.url });
  //
  // ---- ここまで ----

  // 検証だけは通っていることを呼び出し側に伝える（実装確認用）
  const validatedSummary = {
    itemCount: validated.length,
    subtotal: validated.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    ),
  };

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        message:
          "ただいまこの画面でのオンライン決済をご利用いただけません。お手数ですが、公式オンラインショップまたはお電話にてご注文ください。",
        ...validatedSummary,
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    {
      message:
        "決済処理が未実装です。api/checkout/route.ts の実装を完了してください。",
      ...validatedSummary,
    },
    { status: 501 },
  );
}
