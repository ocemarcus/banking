ALTER TYPE "public"."statusTransaction" ADD VALUE 'rollback';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "statusTransaction" "statusTransaction" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");