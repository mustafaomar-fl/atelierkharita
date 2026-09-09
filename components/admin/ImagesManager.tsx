"use client";

import { useRef, useState } from "react";
import type { ImageSlot } from "@/lib/imageSlots";

type SlotStatus = "idle" | "uploading" | "error";

function groupByGroup(slots: ImageSlot[]) {
  const groups: { group: string; slots: ImageSlot[] }[] = [];
  for (const slot of slots) {
    let g = groups.find((x) => x.group === slot.group);
    if (!g) {
      g = { group: slot.group, slots: [] };
      groups.push(g);
    }
    g.slots.push(slot);
  }
  return groups;
}

function SlotCard({ slot }: { slot: ImageSlot }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState<SlotStatus>("idle");
  const [broken, setBroken] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("slot", slot.key);
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("upload_failed");
      setBroken(false);
      setVersion((v) => v + 1);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
        {broken ? (
          <span className="px-2 text-center text-xs text-neutral-400">لا توجد صورة بعد</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/${slot.path}?v=${version}`}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        )}
      </div>

      <span className="text-sm font-semibold text-neutral-700">{slot.label}</span>

      <label className="cursor-pointer rounded-full border border-primary px-3 py-1.5 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
        {status === "uploading" ? "جارٍ الرفع…" : "رفع صورة"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={status === "uploading"}
        />
      </label>

      {status === "error" && (
        <span className="text-xs font-semibold text-red-600">فشل الرفع — حاول مرة أخرى</span>
      )}
    </div>
  );
}

export default function ImagesManager({ slots }: { slots: ImageSlot[] }) {
  const groups = groupByGroup(slots);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.group}>
          <h2 className="mb-3 font-semibold text-neutral-800">{group.group}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {group.slots.map((slot) => (
              <SlotCard key={slot.key} slot={slot} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
