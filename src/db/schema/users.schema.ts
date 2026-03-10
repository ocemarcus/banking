import { bigint, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
	id: bigint({ mode: 'bigint' }).primaryKey(),
	fullName: varchar().notNull(),
	cellPhone: varchar().notNull(),
	document: varchar().notNull(),
	password: varchar('password').notNull(),
	email: varchar().notNull().unique(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
