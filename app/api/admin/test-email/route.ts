import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdminRequest } from "@/lib/adminAuth";

const OWNER_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || "atelierkharita@gmail.com";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS, EMAIL_FROM } =
    process.env;

  if (!EMAIL_SMTP_HOST || !EMAIL_SMTP_USER || !EMAIL_SMTP_PASS) {
    return NextResponse.json({ error: "SMTP is not configured" }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_SMTP_HOST,
      port: Number(EMAIL_SMTP_PORT ?? 587),
      secure: Number(EMAIL_SMTP_PORT) === 465,
      auth: { user: EMAIL_SMTP_USER, pass: EMAIL_SMTP_PASS },
    });

    await transporter.sendMail({
      from: EMAIL_FROM || EMAIL_SMTP_USER,
      to: OWNER_EMAIL,
      subject: "Atelier Kharita test email",
      text: "This is a test email from Atelier Kharita.",
    });

    return NextResponse.json({ sentTo: OWNER_EMAIL });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
