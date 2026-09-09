export type Service = {
  id: string;
  category: string;
  item: string;
  price: number;
  priceUnit: string;
};

export function slugifyCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function groupServicesByCategory(services: Service[]) {
  const groups: { category: string; items: Service[] }[] = [];
  for (const service of services) {
    let group = groups.find((g) => g.category === service.category);
    if (!group) {
      group = { category: service.category, items: [] };
      groups.push(group);
    }
    group.items.push(service);
  }
  return groups;
}
