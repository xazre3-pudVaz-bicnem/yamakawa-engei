/**
 * JSON-LD を出力する。
 * dangerouslySetInnerHTML を使うのは構造化データのため。
 * "<" をエスケープして、値に混入したタグでスクリプトが閉じないようにする。
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
