"use client";

import { useState } from "react";
import type { BookingRecord, BookingStatus } from "@/lib/bookings";

const STATUS_LABELS: Record<BookingStatus, string> = {
  received: "تم الاستلام",
  confirmed: "مؤكد",
  done: "منجز",
};

const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  received: "bg-primary/10 text-primary",
  confirmed: "bg-accent/20 text-accent-dark",
  done: "bg-green-100 text-green-700",
};

export default function OrdersTable({ bookings: initial }: { bookings: BookingRecord[] }) {
  const [bookings, setBookings] = useState(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function setStatus(id: string, status: BookingStatus) {
    const previous = bookings;
    setPendingId(id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBookings(previous);
    } finally {
      setPendingId(null);
    }
  }

  async function deleteBooking(id: string) {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    const previous = bookings;
    setPendingId(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBookings(previous);
      window.alert("تعذّر حذف الطلب — حاول مرة أخرى.");
    } finally {
      setPendingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
        لا توجد حجوزات بعد.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full min-w-[1100px] text-start text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <th className="px-4 py-3 text-start font-semibold">تاريخ الإرسال</th>
            <th className="px-4 py-3 text-start font-semibold">الاسم</th>
            <th className="px-4 py-3 text-start font-semibold">الهاتف</th>
            <th className="px-4 py-3 text-start font-semibold">وقت التسليم</th>
            <th className="px-4 py-3 text-start font-semibold">الخدمات</th>
            <th className="px-4 py-3 text-start font-semibold">الوصف</th>
            <th className="px-4 py-3 text-start font-semibold">الحالة</th>
            <th className="px-4 py-3 text-start font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                {new Date(booking.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-semibold text-neutral-800">{booking.name}</td>
              <td className="px-4 py-3 text-neutral-700">{booking.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap text-neutral-700">
                {new Date(booking.dropOffTime).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {booking.services.length ? booking.services.join("، ") : "—"}
              </td>
              <td className="max-w-xs px-4 py-3 text-neutral-700">
                {booking.description || "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col items-start gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[booking.status]}`}
                  >
                    {STATUS_LABELS[booking.status]}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={pendingId === booking.id}
                      onClick={() => setStatus(booking.id, "confirmed")}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        booking.status === "confirmed"
                          ? "bg-primary text-white"
                          : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      مؤكد
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === booking.id}
                      onClick={() => setStatus(booking.id, "done")}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        booking.status === "done"
                          ? "bg-primary text-white"
                          : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      منجز
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={pendingId === booking.id}
                  onClick={() => deleteBooking(booking.id)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
