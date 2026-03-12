import { TransactionsDto } from "@cqrs/transactions/interfaces/dto/transactions.dto";
import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import {
	accountSchema,
	accountSnapshotSchema,
	accountUsersSnapshotSchema
} from "@db/schema/account.schema";
import {
	transactionsOwnerSchema,
	transactionsSchema
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
	}): Promise<void> {
		await this.db.transaction(async (tx) => {

			const isInOut = /In/.test(data.transaction.typeTransaction)

			const [accountResponse] = await tx
				.update(accountSchema)
				.set({
					balance: isInOut
						? sql`balance + ${data.transaction.amount}`
						: sql`balance - ${data.transaction.amount}`,
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

			const balance = isInOut
				? sql`balance + ${data.transaction.amount}`
				: sql`balance - ${data.transaction.amount}`

			const totalInOut = isInOut ? { totalIn: sql`"totalIn" + ${data.transaction.amount}` } : { totalOut: sql`"totalOut" + ${data.transaction.amount}` }

			await tx.update(accountSnapshotSchema).set({
				balance,
				...totalInOut

			} as any).where(
				eq(accountSnapshotSchema.accountId, data.account.accountId)
			)

			await tx.update(accountUsersSnapshotSchema).set({
				balance,
				...totalInOut

			} as any).where(
				eq(accountUsersSnapshotSchema.userId, accountResponse.userId!)
			)

			data.transaction.nextBalance = accountResponse.balance;
			data.transaction.accountVersion = accountResponse.version

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
	async saveP2P(transaction: CreateTransactionsEntity): Promise<void> {
		await this.db.transaction(async (tx) => {

			const [accountOrigin] = await tx
				.update(accountSchema)
				.set({
					version: sql`${accountSchema.version} + 1`,
					balance: sql`${accountSchema.balance} - ${transaction.amount}`,
					pendingBalance: sql`${accountSchema.pendingBalance} + ${transaction.amount}`,
				})
				.where(
					and(
						eq(accountSchema.id, transaction.accountId!),
						eq(accountSchema.version, transaction.accountVersion),
						gte(accountSchema.balance, transaction.amount),
					),
				)
				.returning();

			if (!accountOrigin) {
				tx.rollback();
			}

			await tx.update(accountUsersSnapshotSchema).set({
				totalOut: sql`"totalOut" + ${transaction.amount}`
			} as any).where(
				eq(accountUsersSnapshotSchema.userId, accountOrigin.userId!)
			)

			await tx.update(accountSnapshotSchema).set({
				totalOut: sql`"totalOut" + ${transaction.amount}`
			} as any).where(
				eq(accountSnapshotSchema.accountId, transaction.accountId!)
			)

			transaction.nextBalance = accountOrigin.balance
			transaction.accountVersion = accountOrigin.version

			await tx.insert(transactionsSchema).values(transaction);
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
