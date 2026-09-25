"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/prices", label: "الأسعار" },
  { href: "/admin/images", label: "الصور" },
  { href: "/admin/content", label: "النصوص والبيانات الوصفية" },
  { href: "/admin/business", label: "بيانات النشاط" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="font-bold text-primary">أتيليه خاريتا — لوحة التحكم</span>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="ms-2 rounded-full px-4 py-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              تسجيل الخروج
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
