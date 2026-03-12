import { TransactionsDto } from "@controller/transactions/dto/transations.dto";
import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import {
	accountSchema,
} from "@db/schema/account.schema";
import {
	transactionDailyStatsSchema,
	transactionsOwnerSchema,
	transactionsSchema,
} from "@db/schema/transactions.schema";
import { Injectable } from "@nestjs/common";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import moment from "moment";

export type CreateTransactionsEntity = typeof transactionsSchema.$inferInsert;
export type TransactionsOwnerEntity =
	typeof transactionsOwnerSchema.$inferInsert;

@Injectable()
export class TransactionsRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async find(params: TransactionsDto, userId: string) {
		const debit = alias(transactionsOwnerSchema, "debit");
		const credit = alias(transactionsOwnerSchema, "credit");

		const where = TransactionsRepository.search(params);

		where.push(eq(accountSchema.userId, BigInt(userId)));

		const [data, total] = await Promise.all([
			this.db
				.select({
					id: transactionsSchema.id,

					amount: transactionsSchema.amount,

					updateAt: transactionsSchema.updatedAt,
					createdAt: transactionsSchema.createdAt,

					typeTransaction: transactionsSchema.typeTransaction,
					statusTransaction: transactionsSchema.statusTransaction,

					account: {
						id: accountSchema.id,
						accountNumber: accountSchema.accountNumber,
					},

					debit: {
						id: debit.id,
						fullName: debit.fullName,
						document: debit.document,
						bankName: debit.bankAccount,
						bankAccount: debit.bankAccount,
					},
					credit: {
						id: credit.id,
						fullName: credit.fullName,
						document: credit.document,
						bankName: credit.bankAccount,
						bankAccount: credit.bankAccount,
					},
				})
				.from(transactionsSchema)
				.innerJoin(
					accountSchema,
					eq(accountSchema.id, transactionsSchema.accountId),
				)
				.leftJoin(debit, eq(debit.id, transactionsSchema.debitId))
				.leftJoin(credit, eq(credit.id, transactionsSchema.creditId))
				.where(and(...where))
				.limit(+params.limit)
				.offset(+params.page)
				.orderBy(desc(transactionsSchema.id)),

			this.db
				.select({ total: count(transactionsSchema.id) })
				.from(transactionsSchema)
				.innerJoin(
					accountSchema,
					eq(accountSchema.id, transactionsSchema.accountId),
				)
				.leftJoin(debit, eq(debit.id, transactionsSchema.debitId))
				.leftJoin(credit, eq(credit.id, transactionsSchema.creditId))
				.where(and(...where)),
		]);

		return { data, total: total[0].total };
	}

	async save(data: {
		transaction: CreateTransactionsEntity;
		account: {
			version: number;
			accountId: bigint;
		};
		transactionDate: string;
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
				tx.rollback();
			}

			await tx
				.insert(transactionDailyStatsSchema)
				.values({
					transactionCount: "1",
					[data.transaction.typeTransaction]: data.transaction.amount,

					accountId: data.account.accountId,
					transactionDate: data.transactionDate,
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

			data.transaction.nextBalance = accountResponse.balance;
			await tx.insert(transactionsSchema).values(data.transaction);
		});
	}

	async findRollbackDetail(transactionId: string, userId: string) {
		const [response] = await this.db
			.select({
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
				},
			})
			.from(transactionsSchema)
			.innerJoin(
				accountSchema,
				eq(accountSchema.id, transactionsSchema.accountId),
			)
			.innerJoin(
				transactionsOwnerSchema,
				eq(transactionsOwnerSchema.id, transactionsSchema.debitId),
			)
			.where(
				and(
					eq(accountSchema.userId, BigInt(userId)),
					eq(transactionsSchema.id, BigInt(transactionId)),
				),
			);
		return response;
	}

	async findOwnerOrSave(owner: TransactionsOwnerEntity): Promise<string> {
		const [response] = await this.db
			.select({ id: transactionsOwnerSchema.id })
			.from(transactionsOwnerSchema)
			.where(eq(transactionsOwnerSchema.bankAccount, owner.bankAccount));

		if (!response?.id) {
			await this.db.insert(transactionsOwnerSchema).values(owner);
			return owner.id.toString();
		}
		return response.id.toString();
	}
	async saveP2P(data: {
		transactions: CreateTransactionsEntity[];
		accountOrigin: {
			version: number;
			accountId: bigint;
		};
		accountDestination: {
			version: number;
			accountId: bigint;
		};
	}): Promise<void> {
		await this.db.transaction(async (tx) => {
			const [transaction] = data.transactions;

			const [accountOrigin] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} - ${transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountOrigin.accountId),
						eq(accountSchema.version, data.accountOrigin.version.toString()),
					),
				)
				.returning();

			if (!accountOrigin) {
				tx.rollback();
			}
			const [accountDestination] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} + ${transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountDestination.accountId),
						eq(
							accountSchema.version,
							data.accountDestination.version.toString(),
						),
					),
				)
				.returning();

			if (!accountDestination) {
				tx.rollback();
			}

			data.transactions[0].nextBalance = accountOrigin.balance
			data.transactions[1].nextBalance = accountDestination.balance

			await tx.insert(transactionsSchema).values(data.transactions);
		});
	}

	public async rollback(data: {
		transaction: CreateTransactionsEntity;
		accountOrigin: {
			version: number;
			accountId: bigint;
		};
		accountDestination: {
			version: number;
			accountId: bigint;
		};
	}): Promise<void> {

		await this.db.transaction(async (tx) => {

			const [accountOrigin] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} - ${data.transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountOrigin.accountId),
						eq(accountSchema.version, data.accountOrigin.version.toString()),
					),
				)
				.returning();

			if (!accountOrigin) {
				tx.rollback();
			}
			const [accountDestination] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} + ${data.transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountDestination.accountId),
						eq(
							accountSchema.version,
							data.accountDestination.version.toString(),
						),
					),
				)
				.returning();

			if (!accountDestination) {
				tx.rollback();
			}

			data.transaction.nextBalance = accountOrigin.balance
			await tx.insert(transactionsSchema).values(data.transaction);
		});
	}

	static search(params: TransactionsDto) {
		const where: any[] = [];

		where.push(
			lte(
				transactionsSchema.createdAt,
				moment(params.endDate).endOf("day").format(),
			),
			gte(
				transactionsSchema.createdAt,
				moment(params.startDate).startOf("day").format(),
			),
		);

		if (params.typeTransaction) {
			where.push(
				eq(transactionsSchema.typeTransaction, params.typeTransaction as any),
			);
		}
		if (params.accountNumber) {
			where.push(eq(accountSchema.accountNumber, params.accountNumber));
		}

		return where;
	}
}
