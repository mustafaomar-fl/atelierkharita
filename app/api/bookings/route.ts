import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createBooking, type BookingRecord } from "@/lib/bookings";

const OWNER_EMAIL = "atelierkharita@gmail.com";

type BookingPayload = {
  name: string;
  phone: string;
  dropOffTime: string;
  services: string[];
  description: string;
  termsAccepted: boolean;
  locale: string;
};

async function sendOwnerNotification(record: BookingRecord) {
  const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS, EMAIL_FROM } =
    process.env;

  if (!EMAIL_SMTP_HOST || !EMAIL_SMTP_USER || !EMAIL_SMTP_PASS) {
    console.warn(
      "[bookings] SMTP is not configured (see .env.example) — skipping owner notification email."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    port: Number(EMAIL_SMTP_PORT ?? 587),
    secure: Number(EMAIL_SMTP_PORT) === 465,
    auth: { user: EMAIL_SMTP_USER, pass: EMAIL_SMTP_PASS },
  });

  const lines = [
    `New booking received (#${record.id})`,
    "",
    `Name: ${record.name}`,
    `Phone: ${record.phone}`,
    `Drop-off time: ${record.dropOffTime}`,
    `Services: ${record.services.length ? record.services.join(", ") : "None specified"}`,
    `Description: ${record.description || "-"}`,
    `Locale: ${record.locale}`,
    `Submitted at: ${record.createdAt}`,
  ];

  await transporter.sendMail({
    from: EMAIL_FROM || EMAIL_SMTP_USER,
    to: OWNER_EMAIL,
    subject: `New booking from ${record.name}`,
    text: lines.join("\n"),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<BookingPayload> | null;

  if (
    !body ||
    !body.name?.trim() ||
    !body.phone?.trim() ||
    !body.dropOffTime?.trim() ||
    body.termsAccepted !== true
  ) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const record: BookingRecord = {
    id: randomUUID(),
    name: body.name.trim(),
    phone: body.phone.trim(),
    dropOffTime: body.dropOffTime,
    services: Array.isArray(body.services) ? body.services : [],
    description: body.description?.trim() || "",
    termsAccepted: true,
    status: "received",
    createdAt: new Date().toISOString(),
    locale: body.locale || "en",
  };

  await createBooking(record);

  try {
    await sendOwnerNotification(record);
  } catch (error) {
    console.error("[bookings] Failed to send owner notification email:", error);
  }

  return NextResponse.json({ id: record.id }, { status: 201 });
}
