import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  getBooking,
  updateBookingStatus,
  type BookingStatus,
} from "@/lib/bookings";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ASSIGNABLE_STATUSES: BookingStatus[] = ["confirmed", "done"];

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { id?: string; status?: string }
    | null;
  const { id, status } = body ?? {};

  if (typeof id !== "string" || !ASSIGNABLE_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  await updateBookingStatus(id, status as BookingStatus);
  const found = true;

  if (!found) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;

  if (typeof id !== "string") {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const deleted = await db.delete(bookings).where(eq(bookings.id, id)).returning({ id: bookings.id });
  const found = deleted.length > 0;

  if (!found) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
