import { ImageResponse } from "next/og";

/**
 * OGP画像
 *
 * 農園の写真が未提供のため、ブランドカラーの版面で生成している。
 * ライチや農園の写真が用意できたら、この生成をやめて
 * public/images/og/og-default.jpg を metadata.openGraph.images に指定するほうがよい。
 */

export const alt = "山川園芸｜鹿児島・指宿の生ライチ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background: "linear-gradient(135deg, #1e4632 0%, #12301f 100%)",
          color: "#f3ead9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              border: "2px solid #edd0d3",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 10 }}>山川園芸</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 74, lineHeight: 1.35, letterSpacing: 4 }}>
            指宿から、旬のライチを。
          </div>
          <div style={{ display: "flex", width: 120, height: 2, background: "#b93a52" }} />
          <div style={{ fontSize: 28, lineHeight: 1.7, color: "#cfdcd0" }}>
            鹿児島県指宿市山川　農園から産地直送の生ライチ
          </div>
        </div>

        <div style={{ fontSize: 22, letterSpacing: 6, color: "#cfdcd0" }}>
          YAMAKAWA ENGEI ／ IBUSUKI, KAGOSHIMA
        </div>
      </div>
    ),
    size,
  );
}
