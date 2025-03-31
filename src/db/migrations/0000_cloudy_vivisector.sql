CREATE TYPE "public"."admin_role" AS ENUM('super_admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."rank" AS ENUM('first', 'second', 'third');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('unread', 'read', 'resolved');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50),
	"hashed_password" text NOT NULL,
	"last_login" timestamp,
	"role" "admin_role",
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255),
	"message" text,
	"submitted_at" timestamp DEFAULT now(),
	"status" "submission_status" DEFAULT 'unread'
);
--> statement-breakpoint
CREATE TABLE "event_winners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid,
	"person_id" uuid,
	"rank" "rank",
	"points_earned" integer,
	"year" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"date" date,
	"year" varchar(20),
	"status" "event_status",
	"registration_link" text,
	"event_image" text,
	"conducted_by" varchar(100) DEFAULT 'IEEE',
	"team_size_min" integer,
	"team_size_max" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"academic_year" varchar(20),
	"description" text,
	"tags" text[],
	"uploaded_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "office_bearers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"position" varchar(100),
	"start_year" varchar(20),
	"end_year" varchar(20),
	"is_current" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"register_number" varchar(50),
	"department" varchar(100),
	"batch" varchar(20),
	"email" varchar(255) NOT NULL,
	"contact_number" varchar(20) DEFAULT null,
	"profile_image" text,
	"total_event_points" integer DEFAULT 0,
	"social_links" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "persons_register_number_unique" UNIQUE("register_number"),
	CONSTRAINT "persons_email_unique" UNIQUE("email"),
	CONSTRAINT "unique_person_identifier" UNIQUE("name","register_number","department")
);
--> statement-breakpoint
ALTER TABLE "event_winners" ADD CONSTRAINT "event_winners_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_winners" ADD CONSTRAINT "event_winners_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "office_bearers" ADD CONSTRAINT "office_bearers_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_id_index" ON "event_winners" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "person_id_index" ON "event_winners" USING btree ("person_id");