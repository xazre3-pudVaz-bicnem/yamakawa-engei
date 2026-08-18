/**
 * 箱詰めの計算（何個口になるか）
 *
 * ─────────────────────────────────────────────
 * このファイルの役割
 * ─────────────────────────────────────────────
 * 「商品の重量」と「1個口に入る重量の上限」だけを受け取り、
 * いちばん少ない個口数になる詰め方を返す。
 *
 * 山川園芸固有の条件（上限が何グラムか・確認済みの組み合わせ）は
 * ここには書かない。すべて src/data/shipping.ts に置く。
 * このファイルは、その条件を受け取って計算するだけの部品。
 *
 * ─────────────────────────────────────────────
 * 計算の考え方
 * ─────────────────────────────────────────────
 * 「重い商品から順に、入るところへ入れる」だけでは
 * 最少の個口数にならない場合がある。
 * そこで、下限（総重量 ÷ 上限の切り上げ）から順に個口数を増やしながら
 * 「その個口数で全部入るか」を総当たりで確かめている。
 * 最初に入りきった個口数が、そのまま最少の個口数になる。
 *
 * 商品点数が多すぎると総当たりの時間が延びるため、
 * 上限を超える注文はエラーにして受け付けない（決済は止まる）。
 */

export type PackItem = {
  /** 内訳の表示に使う名前（例: "生ライチ 500g"） */
  label: string;
  /** 商品1点の重量（g） */
  weightGrams: number;
};

export type PackedParcel = {
  /** この個口に入る商品名 */
  items: string[];
  /** この個口の合計重量（g） */
  weightGrams: number;
};

export type PackingResult =
  | {
      ok: true;
      /** 必要な個口数（最少） */
      count: number;
      /** 個口ごとの内訳 */
      parcels: PackedParcel[];
      /** 商品の総重量（g） */
      totalWeightGrams: number;
    }
  | { ok: false; reason: PackingFailure };

export type PackingFailure =
  /** 商品が1点も無い */
  | "empty"
  /** 重量が未設定・0以下など、計算できない値 */
  | "invalid-weight"
  /** 1個口の上限重量の設定がおかしい */
  | "invalid-capacity"
  /** 1点だけで上限を超える商品がある */
  | "too-heavy"
  /** 総当たりで扱える点数を超えている */
  | "too-many";

/**
 * 総当たりで扱う商品点数の上限。
 * これを超える注文は個口数を確定できないため、決済を止める。
 * （商品ごとの maxQuantity を足しても、通常はここに届かない）
 */
export const MAX_PACKABLE_ITEMS = 24;

/**
 * 最少の個口数になるように箱詰めする。
 *
 * @param items 商品を1点ずつ並べた配列（2点なら同じ商品が2要素）
 * @param capacityGrams 1個口に入れられる重量の上限（g）
 */
export function packItems(
  items: PackItem[],
  capacityGrams: number,
): PackingResult {
  if (!Number.isFinite(capacityGrams) || capacityGrams <= 0) {
    return { ok: false, reason: "invalid-capacity" };
  }
  if (items.length === 0) {
    return { ok: false, reason: "empty" };
  }
  if (
    items.some(
      (item) => !Number.isFinite(item.weightGrams) || item.weightGrams <= 0,
    )
  ) {
    return { ok: false, reason: "invalid-weight" };
  }
  if (items.some((item) => item.weightGrams > capacityGrams)) {
    return { ok: false, reason: "too-heavy" };
  }
  if (items.length > MAX_PACKABLE_ITEMS) {
    return { ok: false, reason: "too-many" };
  }

  // 重いものから置いていくほうが、早く答えにたどり着く
  const sorted = [...items].sort((a, b) => b.weightGrams - a.weightGrams);
  const totalWeightGrams = sorted.reduce(
    (sum, item) => sum + item.weightGrams,
    0,
  );

  // これより少ない個口数にはできない、という下限から試す
  const lowerBound = Math.ceil(totalWeightGrams / capacityGrams);

  for (let count = lowerBound; count <= sorted.length; count++) {
    const parcels = tryPack(sorted, capacityGrams, count);
    if (parcels) {
      return {
        ok: true,
        count,
        parcels: parcels.map((parcel) => ({
          items: parcel.map((item) => item.label),
          weightGrams: parcel.reduce((sum, item) => sum + item.weightGrams, 0),
        })),
        totalWeightGrams,
      };
    }
  }

  // 1点ずつ別の個口に入れれば必ず収まるので、ここには到達しない
  return { ok: false, reason: "too-heavy" };
}

/**
 * 指定した個口数で全部入るかを試す。入れば詰め方を返す。
 *
 * 枝刈り
 *   ・同じ残量の個口は1つだけ試す（並び替えただけの重複を省く）
 *   ・空の個口に入れて失敗したら、ほかの空の個口も結果は同じなので打ち切る
 */
function tryPack(
  sorted: PackItem[],
  capacityGrams: number,
  parcelCount: number,
): PackItem[][] | null {
  const parcels: PackItem[][] = Array.from({ length: parcelCount }, () => []);
  const loads = new Array<number>(parcelCount).fill(0);

  const place = (index: number): boolean => {
    if (index === sorted.length) return true;

    const item = sorted[index];
    const triedLoads = new Set<number>();

    for (let slot = 0; slot < parcelCount; slot++) {
      const load = loads[slot];
      if (load + item.weightGrams > capacityGrams) continue;
      if (triedLoads.has(load)) continue;
      triedLoads.add(load);

      loads[slot] = load + item.weightGrams;
      parcels[slot].push(item);

      if (place(index + 1)) return true;

      parcels[slot].pop();
      loads[slot] = load;

      if (load === 0) break;
    }

    return false;
  };

  return place(0) ? parcels : null;
}
