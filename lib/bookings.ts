import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";

export type BookingStatus = "received" | "confirmed" | "done";

export type BookingRecord = {
  id: string;
  name: string;
  phone: string;
  dropOffTime: string;
  services: string[];
  description: string;
  termsAccepted: boolean;
  status: BookingStatus;
  createdAt: string;
  locale: string;
};

function toBookingRecord(row: typeof bookings.$inferSelect): BookingRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    dropOffTime: row.dropOffTime,
    services: row.services,
    description: row.description,
    termsAccepted: row.termsAccepted,
    status: row.status as BookingStatus,
    createdAt: row.createdAt.toISOString(),
    locale: row.locale,
  };
}

export async function readBookings(): Promise<BookingRecord[]> {
  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  return rows.map(toBookingRecord);
}

export async function getBooking(id: string): Promise<BookingRecord | undefined> {
  const [row] = await db.select().from(bookings).where(eq(bookings.id, id));
  return row ? toBookingRecord(row) : undefined;
}

export async function createBooking(record: BookingRecord): Promise<void> {
  await db.insert(bookings).values({
    id: record.id,
    name: record.name,
    phone: record.phone,
    dropOffTime: record.dropOffTime,
    services: record.services,
    description: record.description,
    termsAccepted: record.termsAccepted,
    status: record.status,
    createdAt: new Date(record.createdAt),
    locale: record.locale,
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}
