import { promises as fs } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";

const LOCALES = ["en", "nl", "ar"] as const;

type Service = {
  id: string;
  category: string;
  item: string;
  price: number;
  priceUnit: string;
};

function messagesPath(locale: string) {
  return path.join(process.cwd(), "messages", `${locale}.json`);
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    price?: number;
    priceUnit?: string;
  } | null;

  const { id, price, priceUnit } = body ?? {};

  if (
    typeof id !== "string" ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0 ||
    typeof priceUnit !== "string" ||
    !priceUnit.trim()
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  let found = false;

  for (const locale of LOCALES) {
    const [stored] = await db.select().from(siteContent).where(eq(siteContent.locale, locale)).limit(1);
    const raw = stored
      ? JSON.stringify(stored.content)
      : await fs.readFile(messagesPath(locale), "utf-8");
    const data = JSON.parse(raw) as { services?: Service[] };
    const service = data.services?.find((s) => s.id === id);
    if (!service) continue;

    found = true;
    service.price = price;
    service.priceUnit = priceUnit.trim();
    await db.insert(siteContent).values({ locale, content: data }).onConflictDoUpdate({
      target: siteContent.locale,
      set: { content: data, updatedAt: new Date() },
    });
  }

  if (!found) {
    return NextResponse.json({ error: "service_not_found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
