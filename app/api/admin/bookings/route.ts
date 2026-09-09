import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { mutateBookings, type BookingStatus } from "@/lib/bookings";

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

  const found = await mutateBookings((bookings) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return false;
    booking.status = status as BookingStatus;
    return true;
  });

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

  const found = await mutateBookings((bookings) => {
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;
    bookings.splice(index, 1);
    return true;
  });

  if (!found) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
