import {
	bigint,
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { tenantSchema } from "./tenant.schema";

export const accountTypeEnum = pgEnum("accountType", ["pf", "pj"]);

export const accountSchema = pgTable("account", {
	id: bigint({ mode: "bigint" }).primaryKey(),

	accountType: accountTypeEnum().notNull(),

	accountNumber: varchar().notNull().unique(),

	balance: numeric().notNull().default("0"),
	pendingBalance: numeric().notNull().default("0"),

	version: numeric().notNull(),

	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id).notNull(),

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

	balance: numeric().default("0"),
	totalIn: numeric().default("0"),
	totalOut: numeric().default("0"),

	accountId: bigint({ mode: "bigint" })
		.references(() => accountSchema.id)
		.primaryKey(),

	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
export const accountTenantSnapshotSchema = pgTable("accountTenantSnapshot", {

	balance: numeric().default("0"),
	totalIn: numeric().default("0"),
	totalOut: numeric().default("0"),

	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id).primaryKey(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
