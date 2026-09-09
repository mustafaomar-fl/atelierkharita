import { promises as fs } from "fs";
import path from "path";
import PricesEditor from "@/components/admin/PricesEditor";
import { groupServicesByCategory, type Service } from "@/lib/services";

// Reads messages/en.json fresh on every request so edits made through this
// dashboard (or directly in the file) show up immediately, instead of a
// stale snapshot baked in at build time.
export const dynamic = "force-dynamic";

async function readServices(): Promise<Service[]> {
  const raw = await fs.readFile(path.join(process.cwd(), "messages", "en.json"), "utf-8");
  const data = JSON.parse(raw) as { services: Service[] };
  return data.services;
}

export default async function PricesPage() {
  const services = await readServices();
  const categories = groupServicesByCategory(services);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">الأسعار</h1>
      <p className="mb-6 text-sm text-neutral-500">
        أسماء الفئات والعناصر تُقرأ من ملف المحتوى الإنجليزي — عدّلها مباشرة في{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5">messages/*.json</code>.
        تغييرات الأسعار هنا تُطبَّق على اللغات الثلاث كلها دفعة واحدة.
      </p>
      <PricesEditor categories={categories} />
    </div>
  );
}
