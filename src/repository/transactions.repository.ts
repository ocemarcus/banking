import { TransactionsDto } from "@controller/transactions/dto/transations.dto";
import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema } from "@db/schema/account.schema";
import {
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

		where.push(eq(accountSchema.userId, userId));

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
				tx.rollback();
			}
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
					eq(accountSchema.userId, userId),
					eq(transactionsSchema.id, transactionId),
				),
			);
		return response;
	}

	async rollback(data: {
		amount: number;
		transactionId: string;

		accountId: string;
		accountBalance: number;
		accountVersion: number;
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

	async findOwnerOrSave(owner: TransactionsOwnerEntity): Promise<string> {
		const [response] = await this.db
			.select({ id: transactionsOwnerSchema.id })
			.from(transactionsOwnerSchema)
			.where(eq(transactionsOwnerSchema.bankAccount, owner.bankAccount));

		if (!response?.id) {
			await this.db.insert(transactionsOwnerSchema).values(owner);
			return owner.id;
		}
		return response.id;
	}
	async saveP2P(data: {
		transactions: CreateTransactionsEntity[];
		account: {
			version: number;
			accountId: string;
		};
		accountFrom: {
			version: number;
			accountId: string;
		};
	}): Promise<void> {
		await this.db.transaction(async (tx) => {
			const [transaction] = data.transactions;

			const [accountResponse] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} - ${transaction.amount}`,
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
			const [accountFromResponse] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} + ${transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, data.accountFrom.accountId),
						eq(accountSchema.version, data.accountFrom.version.toString()),
					),
				)
				.returning();

			if (!accountFromResponse) {
				tx.rollback();
			}

			for (const item of data.transactions) {
				if (item.accountId === accountResponse.id) {
					item.nextBalance = accountResponse.balance;
				}
				if (item.accountId === accountFromResponse.id) {
					item.nextBalance = accountFromResponse.balance;
				}
			}
			await tx.insert(transactionsSchema).values(data.transactions);
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
