/**
 * 計測（GA4）
 *
 * ─────────────────────────────────────────────
 * 現在の状態
 * ─────────────────────────────────────────────
 * 計測タグはまだ入れていません。
 * この関数は「gtag があれば送る、なければ何もしない」という作りなので、
 * タグを入れた瞬間から、すでに仕込んである計測が動き始めます。
 *
 * ─────────────────────────────────────────────
 * GA4 を入れるとき
 * ─────────────────────────────────────────────
 * 1. 測定ID（G-XXXXXXX）を用意する
 * 2. app/layout.tsx に next/script でタグを読み込む
 * 3. 以降、この track() が実際に送信を始める
 *
 * ─────────────────────────────────────────────
 * 送っているイベント
 * ─────────────────────────────────────────────
 * add_to_cart      … カートに入れる（AddToCart）
 * view_cart        … カートを見た（CartContents）
 * begin_checkout   … 決済画面を開いた（StripeCheckout）
 * select_promotion … 解説ページから商品ページへのCTAクリック（ShopCta）
 *                    どの記事から購入導線に入ったかを見るために使う
 */

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: GtagParams) => void;
  }
}

/** GA4 にイベントを送る。タグが無い環境では何もしない */
export function track(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * 解説ページから商品への導線クリック。
 * location に記事のパスを渡すと、
 * 「どのSEO記事が購入導線につながったか」を後から見られる。
 */
export function trackShopCta(location: string, label: string): void {
  track("select_promotion", {
    creative_name: label,
    promotion_name: "guide_to_shop",
    location_id: location,
  });
}
