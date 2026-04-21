import { bigint, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { tenantSchema } from "./tenant.schema";

export const usersSchema = pgTable("users", {
	id: bigint({ mode: 'bigint' }).primaryKey(),

	fullName: varchar().notNull(),
	cellPhone: varchar().notNull(),
	document: varchar().notNull(),
	password: varchar('password').notNull(),
	email: varchar().notNull().unique(),

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
