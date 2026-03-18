import {
	bigint,
	date,
	numeric,
	pgTable,
	primaryKey,
	timestamp,
} from "drizzle-orm/pg-core";
import { accountSchema } from "./account.schema";
import { tenantSchema } from "./tenant.schema";

const columns = {
	pixIn: numeric().default("0"),
	pixOut: numeric().default("0"),
	bankSplitIn: numeric().default("0"),
	bankSplitOut: numeric().default("0"),
	transferInternalIn: numeric().default("0"),
	transferInternalOut: numeric().default("0"),

	transactionDate: date(),
	transactionCount: numeric().default("0"),
};

export const transactionDailyStatsSchema = pgTable(
	"transactionDailyStats",
	{
		...columns,

		accountId: bigint({ mode: "bigint" }).references(() => accountSchema.id),

		tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		}).defaultNow(),

		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.accountId, table.transactionDate] }),
	],
);
export const transactionDailyStatsUserSchema = pgTable(
	"transactionDailyStatsUser",
	{
		...columns,

		tenantId: bigint({ mode: "bigint" }).references(() => tenantSchema.id),

		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		}).defaultNow(),

		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.tenantId, table.transactionDate] })],
);
