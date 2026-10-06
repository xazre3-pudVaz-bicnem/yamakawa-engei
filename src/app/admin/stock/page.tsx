import type { Metadata } from "next";
import {
  adminConfigState,
  isLoggedIn,
  PASSWORD_MIN_LENGTH,
} from "@/lib/admin-auth";
import { NOTE_MAX_LENGTH } from "@/lib/stock";
import { getAllStock, stockManagedProducts } from "@/lib/stock";
import { loginAction, logoutAction, restockAction } from "./actions";

/**
 * 在庫の設定（/admin/stock）
 *
 * 農園がご自分で「またご用意できました」を登録するための画面。
 * スマートフォンで開くことを前提に、字を大きく、押す所を大きくしている。
 *
 * 検索には出さない（noindex ＋ robots.txt）。
 * 合言葉は環境変数 ADMIN_PASSWORD。
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "在庫の設定",
  robots: { index: false, follow: false },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export default async function AdminStockPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const { error, done } = await searchParams;
  const config = adminConfigState();
  const loggedIn = await isLoggedIn();

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-12 md:py-16">
      <h1 className="font-mincho text-[1.5rem] text-forest">在庫の設定</h1>
      <p className="mt-3 text-[0.9rem] leading-[1.95] text-moss">
        「またご用意できました」を、この画面で登録します。
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 border border-lychee/40 bg-lychee/5 px-5 py-4 text-[0.9rem] leading-[1.9] text-lychee-deep"
        >
          {error}
        </p>
      ) : null}

      {done ? (
        <p
          role="status"
          className="mt-6 border border-leaf/40 bg-leaf/5 px-5 py-4 text-[0.9rem] leading-[1.9] text-forest"
        >
          {done}
        </p>
      ) : null}

      {config !== "ok" ? (
        <div className="mt-8 border border-ink/12 bg-paper-warm px-5 py-6 text-[0.9rem] leading-[1.95] text-moss">
          <p>この画面はまだ使えません。</p>
          {config === "missing" ? (
            <p className="mt-3">
              合言葉（環境変数 ADMIN_PASSWORD）がサーバーに届いていません。
              設定したあと、もう一度デプロイが必要です。
            </p>
          ) : (
            <p className="mt-3">
              合言葉が短すぎます。
              {PASSWORD_MIN_LENGTH}文字以上に変えて、もう一度デプロイしてください。
            </p>
          )}
        </div>
      ) : !loggedIn ? (
        <form action={loginAction} className="mt-8">
          <label
            htmlFor="password"
            className="block text-[0.9rem] text-forest"
          >
            合言葉
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-3 w-full border border-ink/20 bg-white px-4 py-4 text-[1rem] text-ink focus:border-forest focus:outline-none"
          />
          <button
            type="submit"
            className="mt-5 w-full border border-forest bg-forest px-8 py-4 text-[0.95rem] tracking-[0.08em] text-cream transition-colors duration-300 hover:bg-forest-deep"
          >
            開く
          </button>
        </form>
      ) : (
        <StockPanel />
      )}
    </main>
  );
}

async function StockPanel() {
  const managed = stockManagedProducts();
  const all = await getAllStock();

  if (managed.length === 0) {
    return (
      <p className="mt-8 text-[0.9rem] leading-[1.95] text-moss">
        いまのところ、残りの数を数えている商品はありません。
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {managed.map((product) => {
        const state = all.get(product.slug) ?? null;

        return (
          <section
            key={product.slug}
            className="border border-ink/12 bg-white px-5 py-6"
          >
            <h2 className="font-mincho text-[1.15rem] text-forest">
              {product.name}
            </h2>

            {state ? (
              <>
                <p className="mt-4 text-[1.6rem] text-ink">
                  残り {state.remaining} 点
                </p>
                <dl className="mt-4 space-y-1.5 text-[0.85rem] text-moss">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0">ご用意した数</dt>
                    <dd>{state.stocked} 点</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0">そのあと売れた数</dt>
                    <dd>{state.sold} 点</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0">数え始めた日時</dt>
                    <dd>{formatDate(state.since)}</dd>
                  </div>
                  {state.note ? (
                    <div className="flex gap-3">
                      <dt className="w-24 shrink-0">お客様への一言</dt>
                      <dd>{state.note}</dd>
                    </div>
                  ) : null}
                </dl>
              </>
            ) : (
              <p className="mt-4 text-[0.9rem] leading-[1.9] text-lychee-deep">
                いま残りの数を確認できません。
                決済の設定をご確認のうえ、時間をおいてお試しください。
              </p>
            )}

            <form action={restockAction} className="mt-7 border-t border-ink/12 pt-6">
              <input type="hidden" name="slug" value={product.slug} />
              <label
                htmlFor={`amount-${product.slug}`}
                className="block text-[0.9rem] leading-[1.9] text-forest"
              >
                いま出荷できる数を入れて、下のボタンを押してください。
                <span className="mt-1 block text-[0.82rem] text-moss">
                  押した時点から数え直します。これより前のご注文は数えません。
                </span>
              </label>
              <input
                id={`amount-${product.slug}`}
                name="amount"
                type="number"
                inputMode="numeric"
                min={0}
                max={999}
                defaultValue={product.stock?.initial ?? 0}
                required
                className="mt-3 w-full border border-ink/20 bg-white px-4 py-4 text-[1.2rem] text-ink focus:border-forest focus:outline-none"
              />

              <label
                htmlFor={`note-${product.slug}`}
                className="mt-7 block text-[0.9rem] leading-[1.9] text-forest"
              >
                次のご用意の目安（空のままで構いません）
                <span className="mt-1 block text-[0.82rem] text-moss">
                  売り切れのあいだ、商品ページにそのまま表示します。
                  日付を約束しない書き方にしてください。
                </span>
              </label>
              <input
                id={`note-${product.slug}`}
                name="note"
                type="text"
                maxLength={NOTE_MAX_LENGTH}
                defaultValue={state?.note ?? ""}
                placeholder="次のご用意は2週間ほど先の見込みです。"
                className="mt-3 w-full border border-ink/20 bg-white px-4 py-4 text-[1rem] text-ink focus:border-forest focus:outline-none"
              />

              <button
                type="submit"
                name="intent"
                value="set"
                className="mt-5 w-full border border-forest bg-forest px-8 py-4 text-[0.95rem] tracking-[0.08em] text-cream transition-colors duration-300 hover:bg-forest-deep"
              >
                この数にする
              </button>

              <button
                type="submit"
                name="intent"
                value="soldout"
                className="mt-3 w-full border border-ink/25 px-8 py-3.5 text-[0.9rem] text-moss transition-colors duration-300 hover:border-ink/50 hover:text-ink"
              >
                売り切れにする（上の数は使いません）
              </button>
            </form>
          </section>
        );
      })}

      <form action={logoutAction}>
        <button
          type="submit"
          className="text-[0.85rem] text-moss underline underline-offset-4 hover:text-ink"
        >
          この画面を閉じる
        </button>
      </form>
    </div>
  );
}
