ALTER TABLE "account" ADD COLUMN "accountNumber" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cellPhone" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_accountNumber_unique" UNIQUE("accountNumber");