import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupServicesByCategory, slugifyCategory, type Service } from "@/lib/services";

export default async function Prices() {
  const t = await getTranslations();
  const services = t.raw("services") as Service[];
  const bookService = t("prices.bookService");
  const categories = groupServicesByCategory(services);

  return (
    <section id="prices" className="bg-surface px-4 py-20 sm:px-6 sm:py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-3">
          <span className="h-0.5 w-10 bg-accent" aria-hidden="true" />
          <h2 className="text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
            {t("prices.title")}
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {categories.map((category) => (
            <article key={category.category} className="group flex flex-col gap-5">
              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-paper shadow-[0_12px_40px_rgba(22,33,62,0.07)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="panel-navy flex items-end justify-between gap-4 px-6 py-5">
                  <div>
                    <span className="mb-1 block font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                      {t("prices.title")}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-paper">
                      {category.category}
                    </h3>
                  </div>
                  <span className="mb-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                </div>
                <ul className="px-6">
                  {category.items.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-baseline gap-3 py-4 transition-colors first:pt-5 last:pb-5 hover:bg-surface"
                    >
                      <span className="font-body text-sm text-ink">{service.item}</span>
                      <span
                        className="flex-1 border-b border-dotted border-primary/20"
                        aria-hidden="true"
                      />
                      <span className="rounded-full bg-surface-dark px-2.5 py-1 font-body text-sm font-semibold whitespace-nowrap text-accent-dark">
                        &euro;{service.price}
                        {service.priceUnit !== "flat" ? ` ${service.priceUnit}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={{ pathname: "/book", query: { service: slugifyCategory(category.category) } }}
                className="inline-flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-3 font-button text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(22,33,62,0.16)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_12px_24px_rgba(22,33,62,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {bookService}
                <span className="text-lg leading-none text-accent" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
