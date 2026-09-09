import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupServicesByCategory, type Service } from "@/lib/services";

export default async function CTA() {
  const t = await getTranslations();
  const services = t.raw("services") as Service[];
  const categories = groupServicesByCategory(services).map((g) => g.category);

  return (
    <section className="bg-gradient-to-br from-primary via-primary via-60% to-accent px-4 py-16 text-center sm:px-6 lg:px-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm text-white/90"
            >
              {category}
            </span>
          ))}
        </div>
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {t("cta.line")}
        </h2>
        <Link
          href="/book"
          className="rounded-full bg-accent px-8 py-3 font-button text-sm font-normal text-primary/70 transition-colors hover:bg-accent-dark sm:text-base"
        >
          {t("cta.button")}
        </Link>
      </div>
    </section>
  );
}
