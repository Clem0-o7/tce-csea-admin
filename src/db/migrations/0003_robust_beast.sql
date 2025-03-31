ALTER TABLE "event_winners" ADD COLUMN "is_team" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "event_winners" ADD COLUMN "team_name" varchar(255);