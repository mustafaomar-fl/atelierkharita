import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupServicesByCategory, type Service } from "@/lib/services";

export default async function CTA() {
  const t = await getTranslations();
  const services = t.raw("services") as Service[];
  const categories = groupServicesByCategory(services).map((g) => g.category);

  return (
    <section className="bg-white px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7">
        <span className="h-0.5 w-10 bg-accent" aria-hidden="true" />
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-md border border-primary/15 px-4 py-1.5 text-sm text-primary/80"
            >
              {category}
            </span>
          ))}
        </div>
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
          {t("cta.line")}
        </h2>
        <Link
          href="/book"
          className="rounded-md bg-accent px-8 py-3 font-button text-sm font-normal text-primary shadow-md transition-colors hover:bg-accent-dark sm:text-base"
        >
          {t("cta.button")}
        </Link>
      </div>
    </section>
  );
}
