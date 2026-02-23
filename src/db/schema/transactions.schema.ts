import {
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
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

	id: uuid().primaryKey(),

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
	id: uuid().primaryKey(),

	amount: numeric().notNull(),

    typeTransaction: typeTransactionEnum().notNull(),

	statusTransaction: statusTransactionEnum().notNull(),
 
	description: varchar(),

	nextBalance: numeric().notNull(),
	previousBalance: numeric().notNull(),

    accountId: uuid().references(() => accountSchema.id),


	debitId: uuid().references(() => transactionsOwnerSchema.id),
	creditId: uuid().references(() => transactionsOwnerSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
