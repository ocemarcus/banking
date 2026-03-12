ALTER TABLE "account" ALTER COLUMN "balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "pendingBalance" numeric DEFAULT '0' NOT NULL;