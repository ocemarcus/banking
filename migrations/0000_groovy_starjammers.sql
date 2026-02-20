CREATE TABLE "account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"balance" numeric NOT NULL,
	"version" numeric NOT NULL,
	"userId" uuid,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullName" varchar NOT NULL,
	"document" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;