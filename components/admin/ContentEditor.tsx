"use client";

import { useEffect, useState } from "react";

export type LocaleContent = {
  hero: { title: string; bookButton: string; pricesButton: string; slideSubtitles: string[] };
  about: {
    ownerName: string;
    ownerRole: string;
    paragraph: string;
  };
  footer: {
    tagline: string;
    hoursNote: string;
    findUsHeading: string;
  };
  meta: { title: string; description: string };
};

type LocaleKey = "en" | "nl" | "ar";

const LOCALE_LABELS: Record<LocaleKey, string> = { en: "English", nl: "Nederlands", ar: "العربية" };

function TextField({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-neutral-700">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-32 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 font-semibold text-neutral-800">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

const SECTION_NAV = [
  { id: "meta", label: "البيانات الوصفية" },
  { id: "hero", label: "القسم الرئيسي" },
  { id: "about", label: "من نحن" },
  { id: "footer", label: "التذييل" },
];

export default function ContentEditor({
  initial,
}: {
  initial: Record<LocaleKey, LocaleContent>;
}) {
  const [locale, setLocale] = useState<LocaleKey>("en");
  const [content, setContent] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeSection, setActiveSection] = useState(SECTION_NAV[0].id);

  const current = content[locale];

  useEffect(() => {
    const ids = SECTION_NAV.map((s) => s.id);
    const SCROLL_OFFSET = 150; // clears the sticky dashboard header + mini-tabs bar

    function computeActive() {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET) {
          current = id;
        }
      }
      setActiveSection(current);
    }

    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    return () => window.removeEventListener("scroll", computeActive);
  }, []);

  function update(updater: (draft: LocaleContent) => LocaleContent) {
    setContent((prev) => ({ ...prev, [locale]: updater(prev[locale]) }));
    setStatus("idle");
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...current }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 rounded-full border border-neutral-200 bg-white p-1 self-start">
        {(Object.keys(LOCALE_LABELS) as LocaleKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setLocale(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              locale === key ? "bg-primary text-white" : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {LOCALE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="sticky top-16 z-[5] flex gap-1 overflow-x-auto rounded-full border border-neutral-200 bg-white/95 p-1 shadow-sm backdrop-blur">
        {SECTION_NAV.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setActiveSection(id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeSection === id ? "bg-primary text-white" : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <Section title="البيانات الوصفية (نتائج بحث جوجل / معاينات الروابط)" id="meta">
        <TextField
          label="عنوان الصفحة"
          value={current.meta.title}
          onChange={(value) => update((draft) => ({ ...draft, meta: { ...draft.meta, title: value } }))}
        />
        <TextField
          label="وصف الصفحة"
          value={current.meta.description}
          onChange={(value) =>
            update((draft) => ({ ...draft, meta: { ...draft.meta, description: value } }))
          }
          multiline
          hint="احرص ألا يتجاوز الوصف 160 حرفًا تقريبًا — الأوصاف الأطول تُقتَطع في نتائج بحث جوجل."
        />
      </Section>

      <Section title="القسم الرئيسي" id="hero">
        <TextField
          label="العنوان"
          value={current.hero.title}
          onChange={(value) => update((draft) => ({ ...draft, hero: { ...draft.hero, title: value } }))}
        />
        <TextField
          label="زر «احجز موعدًا»"
          value={current.hero.bookButton}
          onChange={(value) =>
            update((draft) => ({ ...draft, hero: { ...draft.hero, bookButton: value } }))
          }
        />
        <TextField
          label="زر «تحقق من الأسعار»"
          value={current.hero.pricesButton}
          onChange={(value) =>
            update((draft) => ({ ...draft, hero: { ...draft.hero, pricesButton: value } }))
          }
        />
        {current.hero.slideSubtitles.map((subtitle, i) => (
          <TextField
            key={i}
            label={`العنوان الفرعي للشريحة ${i + 1}`}
            value={subtitle}
            onChange={(value) =>
              update((draft) => {
                const slideSubtitles = [...draft.hero.slideSubtitles];
                slideSubtitles[i] = value;
                return { ...draft, hero: { ...draft.hero, slideSubtitles } };
              })
            }
            multiline
          />
        ))}
      </Section>

      <Section title="من نحن" id="about">
        <TextField
          label="اسم المالك"
          value={current.about.ownerName}
          onChange={(value) =>
            update((draft) => ({ ...draft, about: { ...draft.about, ownerName: value } }))
          }
        />
        <TextField
          label="دور/منصب المالك"
          value={current.about.ownerRole}
          onChange={(value) =>
            update((draft) => ({ ...draft, about: { ...draft.about, ownerRole: value } }))
          }
        />
        <TextField
          label="الفقرة"
          value={current.about.paragraph}
          onChange={(value) =>
            update((draft) => ({ ...draft, about: { ...draft.about, paragraph: value } }))
          }
          multiline
        />
      </Section>

      <Section title="التذييل" id="footer">
        <TextField
          label="الشعار النصي"
          value={current.footer.tagline}
          onChange={(value) =>
            update((draft) => ({ ...draft, footer: { ...draft.footer, tagline: value } }))
          }
        />
        <TextField
          label="ملاحظة ساعات العمل"
          value={current.footer.hoursNote}
          onChange={(value) =>
            update((draft) => ({ ...draft, footer: { ...draft.footer, hoursNote: value } }))
          }
        />
        <TextField
          label="عنوان «أين تجد متجرنا»"
          value={current.footer.findUsHeading}
          onChange={(value) =>
            update((draft) => ({ ...draft, footer: { ...draft.footer, findUsHeading: value } }))
          }
        />
      </Section>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-neutral-200 bg-white/95 p-2 ps-5 shadow-lg backdrop-blur">
        <span className="text-sm text-neutral-500">
          جارٍ تحرير <strong>{LOCALE_LABELS[locale]}</strong>
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className="ms-auto rounded-full bg-accent px-6 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? "جارٍ الحفظ…" : "حفظ التغييرات"}
        </button>
        {status === "saved" && <span className="text-sm font-semibold text-green-600">تم الحفظ</span>}
        {status === "error" && <span className="text-sm font-semibold text-red-600">تعذّر الحفظ</span>}
      </div>
    </div>
  );
}
