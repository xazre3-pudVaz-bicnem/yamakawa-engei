"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * 数量の増減
 *
 * スマホでの操作を優先し、ボタンは 44px 以上の当たり判定を確保する。
 * 数値入力はキーボードからも変更できる。
 */
export default function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  /** 読み上げ用のラベル。例: "生ライチ 500g の数量" */
  label: string;
  size?: "sm" | "md";
}) {
  // 商品名を id に使うと空白や日本語が混ざって label と結びつかないため、
  // React が発行する一意な id を使う。
  const inputId = useId();
  const buttonSize = size === "sm" ? "h-11 w-11" : "h-12 w-12";
  const inputSize = size === "sm" ? "h-11 w-12" : "h-12 w-14";

  return (
    <div className="inline-flex items-stretch border border-ink/20">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label}を1つ減らす`}
        className={cn(
          buttonSize,
          "grid place-items-center text-lg text-forest transition-colors hover:bg-paper-warm disabled:cursor-not-allowed disabled:text-ink/25 disabled:hover:bg-transparent",
        )}
      >
        <span aria-hidden="true">−</span>
      </button>

      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          onChange(Math.min(max, Math.max(min, Math.floor(next))));
        }}
        className={cn(
          inputSize,
          "tnum border-x border-ink/20 bg-transparent text-center text-ink",
          // 数値入力のスピナーは自前のボタンと二重になるため隠す
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${label}を1つ増やす`}
        className={cn(
          buttonSize,
          "grid place-items-center text-lg text-forest transition-colors hover:bg-paper-warm disabled:cursor-not-allowed disabled:text-ink/25 disabled:hover:bg-transparent",
        )}
      >
        <span aria-hidden="true">＋</span>
      </button>
    </div>
  );
}
