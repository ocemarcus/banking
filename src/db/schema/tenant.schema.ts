

import { bigint, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const tenantStatusEnum = pgEnum("tenantStatus", [
    "analysis",
	"active",
	"disabled",
]);

export const tenantSchema = pgTable("tenant", {
	id: bigint({ mode: 'bigint' }).primaryKey(),

	fullName: varchar(),
    document: varchar(),

    email: varchar(),
    cellPhone: varchar(),

    tenantType: tenantStatusEnum().default('analysis'),

	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),

	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});