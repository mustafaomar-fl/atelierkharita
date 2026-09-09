import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdminRequest } from "@/lib/adminAuth";
import { findImageSlot } from "@/lib/imageSlots";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_DIMENSION = 2400; // px, longest side — plenty for a hero banner, keeps files small

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const slotKey = formData?.get("slot");
  const file = formData?.get("file");

  if (typeof slotKey !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const slot = findImageSlot(slotKey);
  if (!slot) {
    return NextResponse.json({ error: "unknown_slot" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "not_an_image" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let pipeline = sharp(inputBuffer).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  pipeline =
    slot.format === "png" ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 85 });

  let outputBuffer: Buffer;
  try {
    outputBuffer = await pipeline.toBuffer();
  } catch {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const destPath = path.join(process.cwd(), "public", slot.path);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, outputBuffer);

  return NextResponse.json({ ok: true, path: `/${slot.path}` });
}
