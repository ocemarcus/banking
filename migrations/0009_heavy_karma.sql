CREATE TABLE "accountSnapshot" (
	"id" bigint PRIMARY KEY NOT NULL,
	"balance" numeric NOT NULL,
	"version" numeric NOT NULL,
	"accountId" bigint,
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
	"transactionCount" numeric DEFAULT '0',
	"transactionDate" date  NOT NULL,
	"accountId" bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),

	PRIMARY KEY ("accountId", "transactionDate")
);
--> statement-breakpoint
DROP TABLE "accountMonthlyStats" CASCADE;--> statement-breakpoint
ALTER TABLE "accountSnapshot" ADD CONSTRAINT "accountSnapshot_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStats" ADD CONSTRAINT "transactionDailyStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;