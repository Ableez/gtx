DO $$ BEGIN
 CREATE TYPE "public"."currency_type" AS ENUM('NGN', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_type" AS ENUM('STANDARD', 'CARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "greatex_trade" RENAME COLUMN "amount" TO "amount_in_currency";--> statement-breakpoint
DROP INDEX IF EXISTS "message_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "trade_amount_idx";--> statement-breakpoint
ALTER TABLE "greatex_chat" ALTER COLUMN "last_message_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_message" 
    ALTER COLUMN "type" SET DATA TYPE message_type USING "type"::message_type-> statement-breakpoint
ALTER TABLE "greatex_message" ALTER COLUMN "type" SET DEFAULT 'STANDARD';--> statement-breakpoint
ALTER TABLE "greatex_trade" ALTER COLUMN "amount_in_currency" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_trade" ALTER COLUMN "amount_in_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_trade" ALTER COLUMN "currency" SET DATA TYPE currency_type;--> statement-breakpoint
ALTER TABLE "greatex_trade" ALTER COLUMN "currency" SET DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE "greatex_chat" ADD COLUMN "trade_id" uuid;--> statement-breakpoint
ALTER TABLE "greatex_trade" ADD COLUMN "amount_in_naira" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_amount_idx" ON "greatex_trade" USING btree ("amount_in_currency");--> statement-breakpoint
ALTER TABLE "greatex_message" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "greatex_trade" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "greatex_trade" DROP COLUMN IF EXISTS "amount_in_dollar";