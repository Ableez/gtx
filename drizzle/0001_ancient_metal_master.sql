ALTER TABLE "greatex_asset" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_asset" ADD COLUMN "popular" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_asset" ADD COLUMN "trade_count" integer DEFAULT 0 NOT NULL;