import { redirect } from "next/navigation";
import { connection } from "next/server";

import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/ui/logo";
import { getAdminSession, usingDevCredentials } from "@/lib/auth/session";

export const instant = false;

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();

  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sand px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <div className="rounded-2xl border border-line bg-cream p-7 shadow-soft sm:p-8">
          <h1 className="text-2xl">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage website content and enquiries.
          </p>
          <div className="mt-6">
            <LoginForm showDevHint={usingDevCredentials()} />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          This area is for authorised staff only.
        </p>
      </div>
    </div>
  );
}
