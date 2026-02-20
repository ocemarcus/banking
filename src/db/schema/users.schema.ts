import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
	id: uuid().primaryKey(),
	fullName: varchar().notNull(),
	cellPhone: varchar().notNull(),
	document: varchar().notNull(),
	email: varchar().notNull(),
	password: varchar('password').notNull(),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});
