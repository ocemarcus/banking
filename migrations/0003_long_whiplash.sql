CREATE TYPE "public"."statusTransaction" AS ENUM('error', 'success', 'pending');--> statement-breakpoint
CREATE TYPE "public"."typeTransaction" AS ENUM('pixIn', 'pixOut', 'bankSplitIn', 'bankSplitOut', 'transferInternalIn', 'transferInternalOut');--> statement-breakpoint
CREATE TABLE "transactionOwner" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullName" varchar NOT NULL,
	"document" varchar NOT NULL,
	"cellPhone" varchar NOT NULL,
	"bankName" varchar NOT NULL,
	"bankAccount" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"typeTransaction" "typeTransaction" NOT NULL,
	"description" varchar,
	"nextBalance" numeric NOT NULL,
	"previousBalance" numeric NOT NULL,
	"accountId" uuid,
	"debitId" uuid,
	"creditId" uuid,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debitId_transactionOwner_id_fk" FOREIGN KEY ("debitId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditId_transactionOwner_id_fk" FOREIGN KEY ("creditId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;