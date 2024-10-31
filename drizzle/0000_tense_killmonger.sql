DO $$ BEGIN
 CREATE TYPE "public"."asset_type" AS ENUM('CRYPTO', 'GIFTCARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."chat_type" AS ENUM('TRADE', 'SUPPORT', 'GENERAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."trade_status" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "asset_type" NOT NULL,
	"name" varchar NOT NULL,
	"cover_image" varchar,
	"description" varchar,
	"quote" varchar,
	"category" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "chat_type" NOT NULL,
	"userId" varchar NOT NULL,
	"asset_id" uuid,
	"last_message_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"url" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"file_name" varchar NOT NULL,
	"size" numeric(10, 0) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"text" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"media_id" varchar,
	"sender" varchar NOT NULL,
	"recipient" varchar,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_trade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"currency" varchar(10) NOT NULL,
	"status" "trade_status" NOT NULL,
	"description" varchar NOT NULL,
	"chat_id" uuid NOT NULL,
	"amount_in_dollar" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image_url" varchar(255),
	"profile_image_url" varchar(255),
	"birthday" timestamp,
	"gender" varchar,
	"password_enabled" boolean DEFAULT true NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"external_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_sign_in_at" timestamp,
	"disabled" boolean DEFAULT false NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_type_idx" ON "greatex_asset" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_name_idx" ON "greatex_asset" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_id_idx" ON "greatex_chat" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_asset_id_idx" ON "greatex_chat" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_type_idx" ON "greatex_chat" USING btree ("userId","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_update_time_idx" ON "greatex_chat" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_owner_id_idx" ON "greatex_media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_type_idx" ON "greatex_media" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_owner_type_idx" ON "greatex_media" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_id_idx" ON "greatex_message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_user_id_idx" ON "greatex_message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_time_idx" ON "greatex_message" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_media_idx" ON "greatex_message" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_id_idx" ON "greatex_trade" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_asset_id_idx" ON "greatex_trade" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_status_idx" ON "greatex_trade" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_status_idx" ON "greatex_trade" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_amount_idx" ON "greatex_trade" USING btree ("amount_in_dollar");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_time_idx" ON "greatex_trade" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "greatex_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_username_idx" ON "greatex_user" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_external_id_idx" ON "greatex_user" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_search_idx" ON "greatex_user" USING btree ("first_name","last_name");