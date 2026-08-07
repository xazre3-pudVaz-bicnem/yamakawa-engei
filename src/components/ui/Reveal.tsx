"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 出現の遅延（秒） */
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "figure" | "article" | "header";
};

/**
 * スクロールに合わせて子要素をゆっくり表示する。
 * アニメーション本体は CSS（.reveal）側にあり、
 * prefers-reduced-motion 時は CSS で無効化される。
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("is-inview");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("reveal", className)}
      style={
        delay > 0
          ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
