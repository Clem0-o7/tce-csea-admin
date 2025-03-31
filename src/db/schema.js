// filepath: /d:/Projects/tce-csea/src/db/schema.js
import { pgTable, uuid, text, timestamp, integer, boolean, varchar, date, jsonb, primaryKey, unique, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum definitions
export const eventStatusEnum = pgEnum('event_status', ['upcoming', 'ongoing', 'completed']);
export const adminRoleEnum = pgEnum('admin_role', ['super_admin', 'editor', 'viewer']);
export const submissionStatusEnum = pgEnum('submission_status', ['unread', 'read', 'resolved']);

// Persons Table
export const persons = pgTable('persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  registerNumber: varchar('register_number', { length: 50 }).unique(),
  department: varchar('department', { length: 100 }),
  batch: varchar('batch', { length: 20 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  contactNumber: varchar('contact_number', { length: 20 }).default(null),
  profileImage: text('profile_image'),
  totalEventPoints: integer('total_event_points').default(0),
  socialLinks: jsonb('social_links').default(null),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()  
}, (table) => ({
  uniquePersonIdentifier: unique('unique_person_identifier').on(
    table.name, 
    table.registerNumber, 
    table.department
  )
}));

// Events Table
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  date: date('date'),
  year: varchar('year', { length: 20 }),
  status: eventStatusEnum('status'),
  registrationLink: text('registration_link'),
  eventImage: text('event_image'),
  conductedBy: varchar('conducted_by', { length: 100 }).default('IEEE'),
  teamSizeMin: integer('team_size_min'),
  teamSizeMax: integer('team_size_max'),
  in_carousal: boolean('in_carousal').default(false),
  participantsCount: integer('participants_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()  
});

// Office Bearers Table
export const officeBearers = pgTable('office_bearers', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id').references(() => persons.id),
  position: varchar('position', { length: 100 }),
  startYear: varchar('start_year', { length: 20 }),
  endYear: varchar('end_year', { length: 20 }),
  isCurrent: boolean('is_current').default(false)
});

// Gallery Images Table
export const galleryImages = pgTable('gallery_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageUrl: text('image_url').notNull(),
  academicYear: varchar('academic_year', { length: 20 }),
  description: text('description'),
  tags: text('tags').array(),
  in_carousal: boolean('in_carousal').default(false),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()  
});

// Contact Submissions Table
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  status: submissionStatusEnum('status').default('unread')
});

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).unique(),
  hashedPassword: text('hashed_password').notNull(),
  lastLogin: timestamp('last_login'),
  role: adminRoleEnum('role')
});

// Magazine Table
export const magazines = pgTable('magazines', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  year: varchar('year', { length: 20 }).notNull(),
  description: text('description'),
  pdfUrl: text('pdf_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  in_carousal: boolean('in_carousal').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()  
}, (table) => ({
  uniqueMagazineIdentifier: unique('unique_magazine_identifier').on(
    table.name, 
    table.year
  )
}));

// Relationship Definitions
export const personRelations = relations(persons, ({ many }) => ({
  officeBearers: many(officeBearers)
}));



export const officeBearersRelations = relations(officeBearers, ({ one }) => ({
  person: one(persons, {
    fields: [officeBearers.personId],
    references: [persons.id]
  })
}));