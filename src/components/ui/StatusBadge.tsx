import { availabilityLabel, type ProductAvailability } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * 販売状況バッジ
 *
 * 在庫数を煽る表示（「残り○個」等）は使わない。
 * 実際のデータで確認できる状態だけを、事実として静かに伝える。
 */
export default function StatusBadge({
  status,
  className,
}: {
  status: ProductAvailability;
  className?: string;
}) {
  const style: Record<ProductAvailability, string> = {
    in_stock: "border-lychee/40 bg-lychee-soft/50 text-lychee-deep",
    preorder: "border-lychee/40 bg-lychee-soft/50 text-lychee-deep",
    sold_out: "border-ink/20 bg-transparent text-moss",
    coming_soon: "border-leaf/40 bg-leaf-pale/45 text-forest",
    draft: "border-ink/20 bg-transparent text-moss",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[0.7rem] tracking-[0.14em]",
        style[status],
        className,
      )}
    >
      {availabilityLabel[status]}
    </span>
  );
}
