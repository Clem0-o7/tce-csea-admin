ALTER TABLE "events" ADD COLUMN "participants_count" integer DEFAULT 0;--> statement-breakpoint
DROP TYPE "public"."rank";