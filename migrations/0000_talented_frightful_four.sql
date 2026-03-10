CREATE TYPE "public"."accountType" AS ENUM('pf', 'pj');--> statement-breakpoint
CREATE TYPE "public"."statusTransaction" AS ENUM('error', 'success', 'pending', 'rollback');--> statement-breakpoint
CREATE TYPE "public"."typeTransaction" AS ENUM('pixIn', 'pixOut', 'bankSplitIn', 'bankSplitOut', 'transferInternalIn', 'transferInternalOut');--> statement-breakpoint
CREATE TABLE "account" (
	"id" bigint PRIMARY KEY NOT NULL,
	"accountType" "accountType" NOT NULL,
	"accountNumber" varchar NOT NULL,
	"balance" numeric NOT NULL,
	"version" numeric NOT NULL,
	"userId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "account_accountNumber_unique" UNIQUE("accountNumber")
);
--> statement-breakpoint
CREATE TABLE "transactionOwner" (
	"id" bigint PRIMARY KEY NOT NULL,
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
	"id" bigint PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"typeTransaction" "typeTransaction" NOT NULL,
	"statusTransaction" "statusTransaction" NOT NULL,
	"description" varchar,
	"nextBalance" numeric NOT NULL,
	"previousBalance" numeric NOT NULL,
	"accountId" bigint,
	"debitId" bigint,
	"creditId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"fullName" varchar NOT NULL,
	"cellPhone" varchar NOT NULL,
	"document" varchar NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debitId_transactionOwner_id_fk" FOREIGN KEY ("debitId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditId_transactionOwner_id_fk" FOREIGN KEY ("creditId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;