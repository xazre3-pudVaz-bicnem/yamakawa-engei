"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn, logIn, logOut } from "@/lib/admin-auth";
import { restock } from "@/lib/stock";

/**
 * 在庫の画面で行う操作
 *
 * 画面を開いた人が農園かどうかは、毎回ここで確かめる。
 * 画面に出ていないボタンを直接叩かれても通らないようにするため。
 */

/** 間違いの回数を数えるための目印。個人を特定するものではない */
async function clientKey(): Promise<string> {
  const list = await headers();
  return (
    list.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    list.get("x-real-ip") ||
    "unknown"
  );
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const result = await logIn(password, await clientKey());

  if (!result.ok) {
    redirect(`/admin/stock?error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/stock");
  redirect("/admin/stock");
}

export async function logoutAction(): Promise<void> {
  await logOut();
  revalidatePath("/admin/stock");
  redirect("/admin/stock");
}

export async function restockAction(formData: FormData): Promise<void> {
  if (!(await isLoggedIn())) {
    redirect("/admin/stock");
  }

  const slug = String(formData.get("slug") ?? "");
  const amount = Number(formData.get("amount"));

  const result = await restock(slug, amount);

  if (!result.ok) {
    redirect(`/admin/stock?error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/stock");
  redirect(
    `/admin/stock?done=${encodeURIComponent(`${result.state.remaining}点にしました。`)}`,
  );
}
