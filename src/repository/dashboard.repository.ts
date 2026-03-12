import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema } from "@db/schema/account.schema";
import { transactionDailyStatsSchema } from "@db/schema/transactions.schema";
import { Injectable } from "@nestjs/common";
import { eq, sum } from "drizzle-orm";



@Injectable()
export class DashboardRepository {
     constructor(@InjectDb() private readonly db: DB) {}

    public async balance(userId: string) {

        const [balance] =  await this.db.select({
              id: accountSchema.id,
              balance: sum(accountSchema.balance),
        })
        .from(accountSchema)
        .where(
            eq(accountSchema.userId, BigInt(userId))
        )
        .groupBy(accountSchema.id)


        const [total] = await this.db.select()
        .from(
            transactionDailyStatsSchema
        ).innerJoin(
             accountSchema,
             eq(accountSchema.id, transactionDailyStatsSchema.accountId)
        )
        .where(
            eq(accountSchema.userId, BigInt(userId))
        )

        if(!balance?.balance) {
            return {
                balance: 0,
                totalIn: 0,
                totalOut: 0,
            }
        }

        return {
             balance: +balance.balance,
             totalIn: +total.transactionDailyStats.pixIn!
             +  +total.transactionDailyStats.transferInternalIn!
             +  +total.transactionDailyStats.bankSplitIn!,
             totalOut: +total.transactionDailyStats.pixOut!
             + +total.transactionDailyStats.transferInternalOut!
             + +total.transactionDailyStats.bankSplitOut!,
        }
    }

    public async dailyDebitCredit(params: {
        startDate: string
        endDate: string
    }) {


       // const [] = await this.db.select().from(accountMonthlyStatsSchema).where()
    }
}