import {
	bigint,
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";
import { accountSchema } from "./account.schema";

export const typeTransactionEnum = pgEnum("typeTransaction", [
	"pixIn",
	"pixOut",
	"bankSplitIn",
	"bankSplitOut",
	"transferInternalIn",
	"transferInternalOut",
]);
export const statusTransactionEnum = pgEnum("statusTransaction", [
	"error",
	"success",
	"pending",
	"rollback",
]);

export const transactionsOwnerSchema = pgTable('transactionOwner', {

	id: bigint({ mode: 'bigint' }).primaryKey(),

    fullName: varchar().notNull(),
    document: varchar().notNull(),
    cellPhone: varchar().notNull(),

    bankName: varchar().notNull(),
    bankAccount: varchar().notNull(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
})

export const transactionsSchema = pgTable("transactions", {
	id: bigint({ mode: 'bigint' }).primaryKey(),

	amount: numeric().notNull(),

    typeTransaction: typeTransactionEnum().notNull(),

	statusTransaction: statusTransactionEnum().notNull(),

	description: varchar(),

	nextBalance: numeric().notNull(),
	previousBalance: numeric().notNull(),

	accountVersion: numeric().notNull(),

	accountId: bigint({ mode: 'bigint' }).references(() => accountSchema.id),


	debitId: bigint({ mode: 'bigint' }).references(() => transactionsOwnerSchema.id),
	creditId: bigint({ mode: 'bigint' }).references(() => transactionsOwnerSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});

