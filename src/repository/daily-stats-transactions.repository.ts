import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { transactionDailyStatsSchema } from "@db/schema/daily-stats.schema";
import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import moment from "moment";


@Injectable()
export class DailyStatsTransactionsRepository {
     constructor(@InjectDb() private readonly db: DB) {}

	async dailyStats(data: {
		amount: number
		tenantId: string
		typeTransaction: string
		accountOriginId: string
	}) {

		const transactionDate = new Date()
		await this.db.transaction(async (tx) => {

			await tx
				.insert(transactionDailyStatsSchema)
				.values({
					transactionCount: "1",
					[data.typeTransaction]: data.amount,

					transactionDate,
					accountId: data.accountOriginId,
				} as any)
				.onConflictDoUpdate({
					target: [
						transactionDailyStatsSchema.accountId,
						transactionDailyStatsSchema.transactionDate,
					],
					set: {
						pixIn: sql`${transactionDailyStatsSchema.pixIn} + excluded."pixIn"`,
						pixOut: sql`${transactionDailyStatsSchema.pixOut} + excluded."pixOut"`,
						bankSplitIn: sql`${transactionDailyStatsSchema.bankSplitIn} + excluded."bankSplitIn"`,
						bankSplitOut: sql`${transactionDailyStatsSchema.bankSplitOut} + excluded."bankSplitOut"`,
						transferInternalIn: sql`${transactionDailyStatsSchema.transferInternalIn} + excluded."transferInternalIn"`,
						transferInternalOut: sql`${transactionDailyStatsSchema.transferInternalOut} + excluded."transferInternalOut"`,
						transactionCount: sql`${transactionDailyStatsSchema.transactionCount} + 1`,
					},
				});
		})

	}


     async dailyStatsP2P(data: {
		 amount: number
		 tenantId: string
         accountOriginId: string
         accountDestinationId: string
     }) {

        const transactionDate = moment().format('YYYY-MM-DD')

        await this.db.transaction( async (tx) => {

        await tx
			.insert(transactionDailyStatsSchema)
				.values({
					transactionCount: "1",
					transferInternalIn: data.amount,

					transactionDate,
					accountId: data.accountDestinationId,
				} as any)
				.onConflictDoUpdate({
					target: [
						transactionDailyStatsSchema.accountId,
						transactionDailyStatsSchema.transactionDate,
					],
					set: {
						transactionCount: sql`${transactionDailyStatsSchema.transactionCount} + 1`,
						transferInternalIn: sql`${transactionDailyStatsSchema.transferInternalIn} + excluded."transferInternalIn"`,
					},
				});

			await tx
				.insert(transactionDailyStatsSchema)
				.values({
					transactionCount: "1",
					transferInternalOut: data.amount,

					transactionDate,
					updatedAt: new Date(),
					accountId: data.accountOriginId,
				} as any)
				.onConflictDoUpdate({
					target: [
						transactionDailyStatsSchema.accountId,
						transactionDailyStatsSchema.transactionDate,
					],
					set: {
						transactionCount: sql`${transactionDailyStatsSchema.transactionCount} + 1`,
						transferInternalOut: sql`${transactionDailyStatsSchema.transferInternalOut} + excluded."transferInternalOut"`,
					},
				});

        } )

     }
}