import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema } from "@db/schema/account.schema";
import { transactionsOwnerSchema, transactionsSchema } from "@db/schema/transactions.schema";
import { Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

export type CreateTransactionsEntity = typeof transactionsSchema.$inferInsert;
export type TransactionsOwnerEntity = typeof transactionsOwnerSchema.$inferInsert

 

@Injectable()
export class TransactionsRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async save(data: {
		transaction: CreateTransactionsEntity;
		account: {
			version: number;
			accountId: string;
		};
	}): Promise<void> {
		await this.db.transaction(async (tx) => {

			const accountBalance = /In/.test(data.transaction.typeTransaction)
				? sql`${accountSchema.balance} + ${data.transaction.amount}`
				: sql`${accountSchema.balance} - ${data.transaction.amount}`;

			const [accountResponse] = await tx
				.update(accountSchema)
				.set({
					balance: accountBalance,
					version: sql`${accountSchema.version} + 1`,
				})
				.where(
					and(
                        eq(accountSchema.id, data.account.accountId),
						eq(accountSchema.version, data.account.version.toString()),
					),
				)
				.returning();

			if (!accountResponse) {
                tx.rollback()
			}
			data.transaction.nextBalance = accountResponse.balance
			await tx.insert(transactionsSchema).values(data.transaction);

		});
	}

	async findRollbackDetail(transactionId: string, userId: string)  {
		const [response] = await this.db.select(
			{
				amount: transactionsSchema.amount,
				typeTransaction: transactionsSchema.typeTransaction,
				statusTransaction: transactionsSchema.statusTransaction,

				debitId: transactionsSchema.debitId,
				creditId: transactionsSchema.creditId,

				account: {
					id: accountSchema.id,
					balance: accountSchema.balance,
					version: accountSchema.version,
					accountNumber: accountSchema.accountNumber,
				},
				owner: {
					id: transactionsOwnerSchema.id,
					bankAccount: transactionsOwnerSchema.bankAccount,
				}
			}
		).from(transactionsSchema)
		.innerJoin(
			accountSchema,
			eq(accountSchema.id, transactionsSchema.accountId)
		)
		.innerJoin(
			transactionsOwnerSchema,
			eq(transactionsOwnerSchema.id, transactionsSchema.debitId)
		)
		.where(
			and(
				eq(accountSchema.userId, userId),
				eq(transactionsSchema.id, transactionId),
			)
		)
		return response
	}

	async rollback(data: {
		   amount: number
		   transactionId: string

		   accountId: string
		   accountBalance: number,
		   accountVersion: number

	}): Promise<void> {

		await this.db.transaction(async (tx) => {
			const [accountResponse] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} - ${data.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountId),
						eq(accountSchema.version, data.accountVersion.toString()),
					),
				)
				.returning();

			if (!accountResponse) {
				tx.rollback();
			}
			await tx
				.update(transactionsSchema)
				.set({ statusTransaction: "rollback" } as any)
				.where(eq(transactionsSchema.id, data.transactionId));
		});
	}
 

	async findOwnerOrSave(owner: TransactionsOwnerEntity ): Promise<string> {

		const [response] = await this.db.select({id: transactionsOwnerSchema.id}).from(transactionsOwnerSchema).where(
			eq(transactionsOwnerSchema.document, owner.document)
		)

		if(!response?.id) {
			 await this.db.insert(transactionsOwnerSchema).values(owner)
			 return owner.id
		}
		return response.id

	}

}
