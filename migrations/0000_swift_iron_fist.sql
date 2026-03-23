CREATE TYPE "public"."accountType" AS ENUM('pf', 'pj');--> statement-breakpoint
CREATE TYPE "public"."ledgerEntryType" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."salesStatus" AS ENUM('success', 'pending', 'error');--> statement-breakpoint
CREATE TYPE "public"."salesType" AS ENUM('pix', 'card');--> statement-breakpoint
CREATE TYPE "public"."tenantStatus" AS ENUM('analysis', 'active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."statusTransaction" AS ENUM('error', 'success', 'pending', 'rollback');--> statement-breakpoint
CREATE TYPE "public"."typeTransaction" AS ENUM('pixIn', 'pixOut', 'bankSplitIn', 'bankSplitOut', 'transferInternalIn', 'transferInternalOut');--> statement-breakpoint
CREATE TABLE "account" (
	"id" bigint PRIMARY KEY NOT NULL,
	"accountType" "accountType" NOT NULL,
	"accountNumber" varchar NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	"pendingBalance" numeric DEFAULT '0' NOT NULL,
	"version" numeric NOT NULL,
	"tenantId" bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "account_accountNumber_unique" UNIQUE("accountNumber")
);
--> statement-breakpoint
CREATE TABLE "accountSnapshot" (
	"balance" numeric DEFAULT '0',
	"totalIn" numeric DEFAULT '0',
	"totalOut" numeric DEFAULT '0',
	"accountId" bigint PRIMARY KEY NOT NULL,
	"tenantId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accountTenantSnapshot" (
	"balance" numeric DEFAULT '0',
	"totalIn" numeric DEFAULT '0',
	"totalOut" numeric DEFAULT '0',
	"tenantId" bigint PRIMARY KEY NOT NULL,
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
	"tenantId" bigint,
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
	"tenantId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transactionDailyStatsUser_tenantId_transactionDate_pk" PRIMARY KEY("tenantId","transactionDate")
);
--> statement-breakpoint
CREATE TABLE "ledgerEntries" (
	"id" bigint PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"tenantId" bigint,
	"accountId" bigint,
	"entryType" "ledgerEntryType" NOT NULL,
	"transactionId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salesCardDetails" (
	"salesId" bigint PRIMARY KEY NOT NULL,
	"cardNumber" varchar,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salesDailyStats" (
	"accountId" bigint,
	"tenantId" bigint,
	"salesDate" date,
	"amount" numeric,
	"salesType" "salesType",
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "salesDailyStats_accountId_salesDate_pk" PRIMARY KEY("accountId","salesDate")
);
--> statement-breakpoint
CREATE TABLE "salesMonthStats" (
	"accountId" bigint,
	"tenantId" bigint,
	"year" numeric,
	"month" numeric,
	"amount" numeric,
	"salesType" "salesType",
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "salesMonthStats_tenantId_year_month_pk" PRIMARY KEY("tenantId","year","month")
);
--> statement-breakpoint
CREATE TABLE "salesPixDetails" (
	"salesId" bigint PRIMARY KEY NOT NULL,
	"pixKey" varchar,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" bigint PRIMARY KEY NOT NULL,
	"accountId" bigint,
	"tenantId" bigint,
	"amount" numeric,
	"salesType" "salesType",
	"salesStatus" "salesStatus",
	"reason" varchar,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar,
	"document" varchar,
	"email" varchar,
	"cellPhone" varchar,
	"tenantType" "tenantStatus" DEFAULT 'analysis',
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
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
	"accountVersion" numeric NOT NULL,
	"tenantId" bigint,
	"accountId" bigint,
	"originalTransactionId" bigint,
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
	"tenantId" bigint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accountSnapshot" ADD CONSTRAINT "accountSnapshot_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accountSnapshot" ADD CONSTRAINT "accountSnapshot_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accountTenantSnapshot" ADD CONSTRAINT "accountTenantSnapshot_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStats" ADD CONSTRAINT "transactionDailyStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStats" ADD CONSTRAINT "transactionDailyStats_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionDailyStatsUser" ADD CONSTRAINT "transactionDailyStatsUser_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgerEntries" ADD CONSTRAINT "ledgerEntries_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgerEntries" ADD CONSTRAINT "ledgerEntries_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgerEntries" ADD CONSTRAINT "ledgerEntries_transactionId_transactions_id_fk" FOREIGN KEY ("transactionId") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesCardDetails" ADD CONSTRAINT "salesCardDetails_salesId_sales_id_fk" FOREIGN KEY ("salesId") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesDailyStats" ADD CONSTRAINT "salesDailyStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesDailyStats" ADD CONSTRAINT "salesDailyStats_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesMonthStats" ADD CONSTRAINT "salesMonthStats_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesMonthStats" ADD CONSTRAINT "salesMonthStats_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesPixDetails" ADD CONSTRAINT "salesPixDetails_salesId_sales_id_fk" FOREIGN KEY ("salesId") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debitId_transactionOwner_id_fk" FOREIGN KEY ("debitId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditId_transactionOwner_id_fk" FOREIGN KEY ("creditId") REFERENCES "public"."transactionOwner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;