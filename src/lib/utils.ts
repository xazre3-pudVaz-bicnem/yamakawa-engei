/** クラス名を条件つきで連結する */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** 価格を「¥2,500」の形式にする。null なら null を返す */
export function formatPrice(value: number | null): string | null {
  if (value === null) return null;
  return `¥${value.toLocaleString("ja-JP")}`;
}

/** "2026-06-25" → "2026年6月25日" */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

/** "2026-06-25" → "2026.06.25" */
export function formatDateDot(iso: string): string {
  return iso.replaceAll("-", ".");
}
