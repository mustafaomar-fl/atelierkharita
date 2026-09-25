import BusinessSettingsEditor from "@/components/admin/BusinessSettingsEditor";
import { readSettings } from "@/lib/settings";

// Always read the settings file fresh so this reflects the latest saved edits.
export const dynamic = "force-dynamic";

export default async function BusinessPage() {
  const settings = await readSettings();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">بيانات النشاط التجاري</h1>
      <p className="mb-6 text-sm text-neutral-500">
        الهاتف، المواقع، وروابط التواصل الاجتماعي — هذه بيانات ثابتة لا علاقة لها باللغة، لذا
        تُدخل هنا مرة واحدة فقط وتظهر تلقائيًا في النسخة الإنجليزية والهولندية والعربية من الموقع.
      </p>
      <BusinessSettingsEditor initial={settings} />
    </div>
  );
}
