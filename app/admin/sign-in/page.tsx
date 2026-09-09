"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          data?.error === "admin_not_configured"
            ? "لم يتم إعداد تسجيل دخول المسؤول بعد — يرجى ضبط ADMIN_PASSWORD وADMIN_SESSION_SECRET."
            : "كلمة المرور غير صحيحة."
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ ما — يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-primary">أتيليه خاريتا</h1>
        <p className="mb-6 text-sm text-neutral-500">سجّل الدخول لإدارة الموقع.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-neutral-700">كلمة المرور</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !password}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-accent-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {submitting ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
