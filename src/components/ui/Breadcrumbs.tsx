import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/**
 * パンくず
 * 画面表示と BreadcrumbList 構造化データを同じ配列から生成するので、
 * 表示と構造化データがずれることがない。
 */
export default function Breadcrumbs({
  items,
  tone = "light",
  className,
}: {
  /** ホームを除いた階層。例: [{ name: "オンラインショップ", path: "/shop" }] */
  items: Crumb[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const all: Crumb[] = [{ name: "ホーム", path: "/" }, ...items];
  const dark = tone === "dark";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav
        aria-label="パンくずリスト"
        className={cn(
          "text-[0.72rem] tracking-[0.08em]",
          dark ? "text-cream/70" : "text-moss",
          className,
        )}
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((crumb, index) => {
            const isLast = index === all.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <>
                    <Link
                      href={crumb.path}
                      className={cn(
                        "underline-offset-4 hover:underline",
                        dark ? "hover:text-cream" : "hover:text-forest",
                      )}
                    >
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="opacity-50">
                      ／
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
