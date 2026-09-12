import { jsonb, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  dropOffTime: text("drop_off_time").notNull(),
  services: jsonb("services").$type<string[]>().notNull().default([]),
  description: text("description").notNull().default(""),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  locale: text("locale").notNull().default("en"),
});
