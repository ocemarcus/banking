import {
	bigint,
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users.schema";

export const accountTypeEnum = pgEnum("accountType", ["pf", "pj"]);

export const accountSchema = pgTable("account", {
	id: bigint({ mode: "bigint" }).primaryKey(),

	accountType: accountTypeEnum().notNull(),

	accountNumber: varchar().notNull().unique(),

	balance: numeric().notNull().default('0'),
	pendingBalance: numeric().notNull().default('0'),

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



export const accountSnapshotSchema = pgTable("accountSnapshot", {

	balance: numeric().default('0'),
	totalIn: numeric().default('0'),
	totalOut: numeric().default('0'),

	accountId: bigint({ mode: "bigint" }).references(() => accountSchema.id).primaryKey(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
export const accountUsersSnapshotSchema = pgTable("accountUsersSnapshot", {

	balance: numeric().default('0'),
	totalIn: numeric().default('0'),
	totalOut: numeric().default('0'),

	userId: bigint({ mode: "bigint" }).references(() => usersSchema.id).primaryKey(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});


