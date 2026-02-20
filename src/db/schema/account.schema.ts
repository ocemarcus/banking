import {
	numeric,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./users.schema";

export const accountTypeEnum = pgEnum("accountType", ["pf", "pj"]);

export const accountSchema = pgTable("account", {
	id: uuid().primaryKey(),

	accountType: accountTypeEnum().notNull(),

	accountNumber: varchar().notNull().unique(),

	balance: numeric().notNull(),
	version: numeric().notNull(),

	userId: uuid().references(() => usersSchema.id),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
