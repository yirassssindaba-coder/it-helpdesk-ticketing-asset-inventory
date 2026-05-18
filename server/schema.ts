import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  ticketId: varchar('ticket_id', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  category: varchar('category', { length: 50 }).notNull().default('Hardware'),
  division: varchar('division', { length: 100 }).notNull().default(''),
  requesterName: varchar('requester_name', { length: 100 }).notNull(),
  requesterEmail: varchar('requester_email', { length: 150 }).notNull().default(''),
  assignedTo: varchar('assigned_to', { length: 100 }).notNull().default(''),
  slaHours: integer('sla_hours').notNull().default(24),
  resolutionNotes: text('resolution_notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  assetId: varchar('asset_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull().default('laptop'),
  status: varchar('status', { length: 30 }).notNull().default('active'),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().default(''),
  purchaseDate: varchar('purchase_date', { length: 20 }).notNull().default(''),
  warrantyExpiry: varchar('warranty_expiry', { length: 20 }).notNull().default(''),
  assignedTo: varchar('assigned_to', { length: 100 }).notNull().default(''),
  department: varchar('department', { length: 100 }).notNull().default(''),
  location: varchar('location', { length: 150 }).notNull().default(''),
  licenseKey: varchar('license_key', { length: 255 }).notNull().default(''),
  licenseExpiry: varchar('license_expiry', { length: 20 }).notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
