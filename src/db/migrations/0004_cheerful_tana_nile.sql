ALTER TABLE "event_winners" DROP CONSTRAINT "event_winners_event_id_events_id_fk";
--> statement-breakpoint
DROP INDEX "event_id_index";--> statement-breakpoint
ALTER TABLE "event_winners" ADD COLUMN "event_name" varchar(255);--> statement-breakpoint
ALTER TABLE "event_winners" ADD COLUMN "event_date" date;--> statement-breakpoint
ALTER TABLE "event_winners" DROP COLUMN "event_id";