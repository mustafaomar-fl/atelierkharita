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
            <div key={category.category} className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
                <div className="flex items-center gap-4 px-5 py-4">
                  <h3 className="font-heading text-base font-semibold whitespace-nowrap text-primary">
                    {category.category}
                  </h3>
                  <span className="h-px flex-1 bg-accent/50" aria-hidden="true" />
                </div>
                <ul className="divide-y divide-primary/8 px-5">
                  {category.items.map((service) => (
                    <li key={service.id} className="flex items-baseline gap-3 py-3.5">
                      <span className="font-body text-sm text-neutral-700">{service.item}</span>
                      <span
                        className="flex-1 border-b border-dotted border-primary/20"
                        aria-hidden="true"
                      />
                      <span className="font-body text-sm font-semibold whitespace-nowrap text-accent-dark">
                        &euro;{service.price}
                        {service.priceUnit !== "flat" ? ` ${service.priceUnit}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="h-2" />
              </div>
              <Link
                href={{ pathname: "/book", query: { service: slugifyCategory(category.category) } }}
                className="self-start rounded-md border border-primary px-4 py-2 font-button text-sm font-normal text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {bookService}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
