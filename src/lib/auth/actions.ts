"use server";

import { redirect } from "next/navigation";

import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
  verifyCredentials,
} from "./session";

export type LoginState = { error: string | null } | null;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email address and password." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Invalid email address or password." };
  }

  await setSessionCookie(createSessionToken(user));
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
