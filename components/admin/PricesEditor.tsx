"use client";

import { useState } from "react";
import type { Service } from "@/lib/services";

type Category = { category: string; items: Service[] };
type RowState = { price: string; priceUnit: string };
type RowStatus = "idle" | "saving" | "saved" | "error";

export default function PricesEditor({ categories }: { categories: Category[] }) {
  const [rows, setRows] = useState<Record<string, RowState>>(() => {
    const initial: Record<string, RowState> = {};
    for (const category of categories) {
      for (const service of category.items) {
        initial[service.id] = { price: String(service.price), priceUnit: service.priceUnit };
      }
    }
    return initial;
  });
  const [status, setStatus] = useState<Record<string, RowStatus>>({});

  function updateRow(id: string, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    setStatus((prev) => ({ ...prev, [id]: "idle" }));
  }

  async function saveRow(id: string) {
    const row = rows[id];
    const price = Number(row.price);
    if (!Number.isFinite(price) || price < 0) {
      setStatus((prev) => ({ ...prev, [id]: "error" }));
      return;
    }

    setStatus((prev) => ({ ...prev, [id]: "saving" }));
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price, priceUnit: row.priceUnit }),
      });
      setStatus((prev) => ({ ...prev, [id]: res.ok ? "saved" : "error" }));
    } catch {
      setStatus((prev) => ({ ...prev, [id]: "error" }));
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <div key={category.category}>
          <h2 className="mb-3 font-semibold text-neutral-800">{category.category}</h2>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
                  <th className="px-4 py-3 text-start font-semibold">العنصر</th>
                  <th className="px-4 py-3 text-start font-semibold">السعر (€)</th>
                  <th className="px-4 py-3 text-start font-semibold">الوحدة</th>
                  <th className="px-4 py-3 text-start font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((service) => {
                  const row = rows[service.id];
                  const rowStatus = status[service.id] ?? "idle";
                  return (
                    <tr
                      key={service.id}
                      className="border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50/80"
                    >
                      <td className="px-4 py-3 text-neutral-700">{service.item}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={row.price}
                          onChange={(e) => updateRow(service.id, { price: e.target.value })}
                          className="w-24 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={row.priceUnit}
                          onChange={(e) => updateRow(service.id, { priceUnit: e.target.value })}
                          className="w-32 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => saveRow(service.id)}
                            disabled={rowStatus === "saving"}
                            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {rowStatus === "saving" ? "جارٍ الحفظ…" : "حفظ"}
                          </button>
                          {rowStatus === "saved" && (
                            <span className="text-xs font-semibold text-green-600">تم الحفظ</span>
                          )}
                          {rowStatus === "error" && (
                            <span className="text-xs font-semibold text-red-600">
                              تعذّر الحفظ
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
