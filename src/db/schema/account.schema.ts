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



export const accountSnapshotSchema = pgTable("accountSnapshot", {
	id: bigint({ mode: "bigint" }).primaryKey(),

	balance: numeric().notNull(),
	version: numeric().notNull(),

	accountId: bigint({ mode: "bigint" }).references(() => accountSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});


