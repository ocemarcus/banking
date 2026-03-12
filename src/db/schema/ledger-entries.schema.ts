import { bigint, numeric, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import { accountSchema } from "./account.schema";
import { transactionsSchema } from "./transactions.schema";


export const ledgerEntryTypeEnum = pgEnum("ledgerEntryType", [
	"credit",
	"debit",
]);

export const ledgerEntriesSchema = pgTable("ledgerEntries", {
	id: bigint({ mode: "bigint" }).primaryKey(),

	amount: numeric().notNull(),

	accountId: bigint({ mode: "bigint" })
		.references(() => accountSchema.id),

    entryType: ledgerEntryTypeEnum().notNull(),

	transactionId: bigint({ mode: "bigint" })
		.references(() => transactionsSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
