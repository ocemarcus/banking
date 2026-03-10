import {
	bigint,
	date,
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users.schema";

export const accountTypeEnum = pgEnum("accountType", ["pf", "pj"]);

export const accountSchema = pgTable("account", {
	id: bigint({ mode: "bigint" }).primaryKey(),

	accountType: accountTypeEnum().notNull(),

	accountNumber: varchar().notNull().unique(),

	balance: numeric().notNull(),
	version: numeric().notNull(),

	userId: bigint({ mode: "bigint" }).references(() => usersSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});

export const accountMonthlyStatsSchema = pgTable("accountMonthlyStats", {

	totalIn: numeric().default("0"),
	totalOut: numeric().default("0"),
	transactionCount: numeric().default("0"),

	transactionDate: date().primaryKey(),

	accountId: bigint({ mode: "bigint" })
		.references(() => accountSchema.id)
		.primaryKey(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
