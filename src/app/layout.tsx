import type { Metadata, Viewport } from "next";
import { EB_Garamond, Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBuyBar from "@/components/layout/MobileBuyBar";
import { CartProvider } from "@/components/cart/CartProvider";
import JsonLd from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { isPublicSite, metadataBaseUrl, siteConfig } from "@/data/siteConfig";
import "./globals.css";

const shippori = Shippori_Mincho({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
  preload: false,
});

const garamond = EB_Garamond({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: "国産の生ライチ通販｜鹿児島・指宿の山川園芸",
    // 日本語の検索結果は30文字前後で切られるため、テンプレートは屋号だけに留める。
    // キーワードは各ページのタイトル側に入れている。
    template: `%s｜${siteConfig.name}`,
  },
  description:
    "鹿児島県指宿市山川の農園から、旬の生ライチを産地直送でお届けします。国産ライチの旬は6月下旬から7月ごろ。食べ方や保存方法もご案内しています。",
  keywords: [
    "国産ライチ 通販",
    "生ライチ",
    "鹿児島 ライチ",
    "指宿 ライチ",
    "ライチ お取り寄せ",
    "ライチ 産地直送",
  ],
  openGraph: {
    title: "国産の生ライチ通販｜鹿児島・指宿の山川園芸",
    description:
      "薩摩半島のいちばん南、指宿市山川。旬のあいだだけ穫れる生のライチを、農園から直接お届けします。",
    siteName: siteConfig.name,
    locale: "ja_JP",
    type: "website",
    ...(isPublicSite ? { url: "/" } : {}),
  },
  twitter: { card: "summary_large_image" },
  ...(isPublicSite
    ? { alternates: { canonical: "/" }, robots: { index: true, follow: true } }
    : { robots: { index: false, follow: false } }),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#12301f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${shippori.variable} ${zenKaku.variable} ${garamond.variable}`}
    >
      {/* JSが動く環境でだけ <html> に .js を付ける。
          スクロール出現アニメーション（.reveal）はこのクラス配下でのみ
          要素を隠すため、JSが無効・失敗しても本文が見えなくなることがない。
          パース中に同期実行されるので、描画前にクラスが付く。 */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      <body className="bg-paper font-gothic text-ink antialiased">
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />

        {/* focus:absolute だと位置決めの基準が文書の先頭になり、
            スクロール中にフォーカスすると画面外へ出てしまう。fixed で固定する。 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          本文へスキップ
        </a>

        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileBuyBar />
        </CartProvider>
      </body>
    </html>
  );
}
