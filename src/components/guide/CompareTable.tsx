/**
 * 比較表
 *
 * 横に長い表はスマホで崩れやすいので、
 * 表そのものを横スクロールできる箱に入れている（ページ全体は横に伸びない）。
 *
 * どちらかを不当に持ち上げる書き方はしないこと。
 * 読む人が自分で選べる材料を並べるための表。
 */
export default function CompareTable({
  caption,
  columns,
  rows,
}: {
  /** 読み上げ用の表題（画面には出さない） */
  caption: string;
  /** 1列目の見出しを除いた列名 */
  columns: string[];
  rows: Array<{ label: string; values: string[] }>;
}) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-y border-ink/15">
            <th scope="col" className="w-28 py-4 pr-4 font-normal text-moss">
              <span className="sr-only">比べる項目</span>
            </th>
            {columns.map((name, index) => (
              <th
                key={name}
                scope="col"
                className={
                  "py-4 pr-6 font-mincho text-[1rem] " +
                  (index === 0 ? "text-lychee-deep" : "text-forest")
                }
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/12">
          {rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="py-4 pr-4 align-top font-normal text-moss"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.label}-${index}`}
                  className={
                    "py-4 pr-6 align-top leading-[1.9] " +
                    (index === 0 ? "" : "text-ink/75")
                  }
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
