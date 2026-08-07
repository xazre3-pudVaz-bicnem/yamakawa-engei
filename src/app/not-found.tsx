import Link from "next/link";
import LinkButton from "@/components/ui/LinkButton";

export const metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-5 py-32 text-center md:px-8">
      <p className="font-serif-en text-[0.72rem] uppercase tracking-[0.34em] text-lychee-deep">
        Not found
      </p>
      <h1 className="mt-5 font-mincho text-[1.7rem] leading-snug text-forest md:text-[2.1rem]">
        お探しのページが見つかりません
      </h1>
      <p className="mt-6 text-[0.92rem] leading-[2.05] text-moss">
        アドレスが変わったか、削除された可能性があります。
        お手数ですが、下記からお探しください。
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <LinkButton href="/" variant="secondary">
          トップページへ
        </LinkButton>
        <LinkButton href="/shop" variant="ghost">
          オンラインショップ
        </LinkButton>
      </div>

      <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.85rem] text-moss">
        {[
          { href: "/lychee", label: "ライチについて" },
          { href: "/how-to-eat", label: "食べ方・保存方法" },
          { href: "/about", label: "山川園芸について" },
          { href: "/faq", label: "よくある質問" },
          { href: "/contact", label: "お問い合わせ" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="underline underline-offset-4 hover:text-forest"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
