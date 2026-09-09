import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

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

export async function readBookings(): Promise<BookingRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BookingRecord[];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: BookingRecord[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
}

// Two concurrent writes could otherwise both read the same file state and
// each write back, silently losing whichever change wrote first. This
// serializes every read-modify-write through the same in-memory queue so
// they never clobber each other. It does not protect against multiple
// server instances writing to the same file — a real database is required
// for that.
let writeQueue: Promise<unknown> = Promise.resolve();

export function mutateBookings<T>(mutator: (bookings: BookingRecord[]) => T): Promise<T> {
  const task = writeQueue.then(async () => {
    const bookings = await readBookings();
    const result = mutator(bookings);
    await writeBookings(bookings);
    return result;
  });
  writeQueue = task.then(
    () => undefined,
    () => undefined
  );
  return task;
}
