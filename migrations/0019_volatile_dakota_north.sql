CREATE TYPE "public"."ledgerEntryType" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TABLE "accountSnapshot" (
	"balance" numeric DEFAULT '0',
	"totalIn" numeric DEFAULT '0',
	"totalOut" numeric DEFAULT '0',
	"accountId" bigint PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accountUsersSnapshot" (
	"balance" numeric DEFAULT '0',
	"totalIn" numeric DEFAULT '0',
	"totalOut" numeric DEFAULT '0',
	"userId" bigint PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactionDailyStats" (
	"pixIn" numeric DEFAULT '0',
	"pixOut" numeric DEFAULT '0',
	"bankSplitIn" numeric DEFAULT '0',
	"bankSplitOut" numeric DEFAULT '0',
	"transferInternalIn" numeric DEFAULT '0',
	"transferInternalOut" numeric DEFAULT '0',
	"transactionDate" date,
	"transactionCount" numeric DEFAULT '0',
	"accountId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transactionDailyStats_accountId_transactionDate_pk" PRIMARY KEY("accountId","transactionDate")
);
--> statement-breakpoint
CREATE TABLE "transactionDailyStatsUser" (
	"pixIn" numeric DEFAULT '0',
	"pixOut" numeric DEFAULT '0',
	"bankSplitIn" numeric DEFAULT '0',
	"bankSplitOut" numeric DEFAULT '0',
	"transferInternalIn" numeric DEFAULT '0',
	"transferInternalOut" numeric DEFAULT '0',
	"transactionDate" date,
	"transactionCount" numeric DEFAULT '0',
	"userId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transactionDailyStatsUser_userId_transactionDate_pk" PRIMARY KEY("userId","transactionDate")
);
--> statement-breakpoint
CREATE TABLE "ledgerEntries" (
	"id" bigint PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"accountId" bigint,
	"entryType" "ledgerEntryType" NOT NULL,
	"transactionId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accountSnapshot" ADD CONSTRAINT "accountSnapshot_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accountUsersSnapshot" ADD CONSTRAINT "accountUsersSnapshot_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStats" ADD CONSTRAINT "transactionDailyStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStatsUser" ADD CONSTRAINT "transactionDailyStatsUser_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgerEntries" ADD CONSTRAINT "ledgerEntries_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgerEntries" ADD CONSTRAINT "ledgerEntries_transactionId_transactions_id_fk" FOREIGN KEY ("transactionId") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;