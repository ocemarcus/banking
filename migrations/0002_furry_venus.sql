CREATE TYPE "public"."accountType" AS ENUM('pf', 'pj');--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "accountType" "accountType" NOT NULL;