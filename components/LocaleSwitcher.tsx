"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-2">
          {index > 0 && <span className="text-white/30">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale}
            className={
              loc === locale
                ? "text-accent"
                : "text-white/70 transition-colors hover:text-white"
            }
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
