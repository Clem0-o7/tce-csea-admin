CREATE TABLE "magazines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" varchar(20) NOT NULL,
	"description" text,
	"pdf_url" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"in_carousal" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_magazine_identifier" UNIQUE("name","year")
);
