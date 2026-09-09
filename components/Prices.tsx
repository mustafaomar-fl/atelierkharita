import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { groupServicesByCategory, slugifyCategory, type Service } from "@/lib/services";

export default async function Prices() {
  const t = await getTranslations();
  const services = t.raw("services") as Service[];
  const priceHeader = t("prices.priceHeader");
  const bookService = t("prices.bookService");
  const categories = groupServicesByCategory(services);

  return (
    <section id="prices" className="bg-neutral-50 px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
          {t("prices.title")}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category.category} className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg border border-accent/30 bg-primary shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-accent text-primary">
                      <th className="px-4 py-3 text-start font-heading text-sm font-semibold">
                        {category.category}
                      </th>
                      <th className="px-4 py-3 text-end font-heading text-sm font-semibold">
                        {priceHeader}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((service) => (
                      <tr key={service.id} className="border-t border-accent/30">
                        <td className="px-4 py-3 text-start font-body text-sm font-semibold text-white">
                          {service.item}
                        </td>
                        <td className="px-4 py-3 text-end font-body text-sm font-semibold text-white">
                          &euro;{service.price}
                          {service.priceUnit !== "flat" ? ` ${service.priceUnit}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href={{ pathname: "/book", query: { service: slugifyCategory(category.category) } }}
                className="self-start rounded-full bg-accent px-4 py-2 font-button text-sm font-normal text-primary transition-colors hover:bg-primary hover:text-white"
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
