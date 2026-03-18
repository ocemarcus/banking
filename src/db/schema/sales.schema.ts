


import { bigint, date, numeric, pgEnum, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { accountSchema } from "./account.schema";
import { tenantSchema } from "./tenant.schema";

export const salesTypeEnum = pgEnum("salesType", [
	"pix",
	"card",
]);
export const salesStatusEnum = pgEnum("salesStatus", [
	"success",
	"pending",
	"error",
]);

export const salesSchema = pgTable("sales", {
	id: bigint({ mode: 'bigint' }).primaryKey(),

    accountId: bigint({mode: 'bigint'}).references(() => accountSchema.id),
	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

    amount: numeric(),
    salesType: salesTypeEnum(),
	salesStatus: salesStatusEnum(),

	reason: varchar(),


	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
export const salesDailyStatsSchema = pgTable("salesDailyStats", {

    accountId: bigint({mode: 'bigint'}).references(() => accountSchema.id),
	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

	salesDate: date(),

    amount: numeric(),
    salesType: salesTypeEnum(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

}, (table) => [primaryKey({columns: [table.accountId, table.salesDate]})]);

export const salesMonthStatsSchema = pgTable("salesMonthStats", {

    accountId: bigint({mode: 'bigint'}).references(() => accountSchema.id),
	tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

	year: numeric(),
	month: numeric(),

    amount: numeric(),
    salesType: salesTypeEnum(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
}, (table) => [primaryKey({columns: [table.tenantId, table.year, table.month]})]);

export const salesPixDetailsSchema = pgTable("salesPixDetails", {

    salesId: bigint({mode: 'bigint'}).references(() => salesSchema.id).primaryKey(),

	pixKey: varchar(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

});
export const salesCardDetailsSchema = pgTable("salesCardDetails", {

    salesId: bigint({mode: 'bigint'}).references(() => salesSchema.id).primaryKey(),

	cardNumber: varchar(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

});