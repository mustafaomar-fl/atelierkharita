import { jsonb, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const siteContent = pgTable("site_content", {
  locale: text("locale").primaryKey(),
  content: jsonb("content").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const imageOverrides = pgTable("image_overrides", {
  slot: text("slot").primaryKey(),
  url: text("url").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

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
