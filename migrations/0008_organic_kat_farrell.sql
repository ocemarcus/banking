CREATE TABLE "accountMonthlyStats" (
	"totalIn" numeric DEFAULT '0',
	"totalOut" numeric DEFAULT '0',
	"transactionCount" numeric DEFAULT '0',
	"transactionDate" date NOT NULL,
	"accountId" bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),

	primary key ("accountId", "transactionDate")
);
--> statement-breakpoint
ALTER TABLE "accountMonthlyStats" ADD CONSTRAINT "accountMonthlyStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;