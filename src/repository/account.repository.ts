import { AccountsDto } from "@controller/account/dto/accounts.dto";
import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema, accountSnapshotSchema, accountTenantSnapshotSchema } from "@db/schema/account.schema";
import { usersSchema } from "@db/schema/users.schema";
import { AccountEntity } from "@entity/account.entity";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { and, count, eq, sql } from "drizzle-orm";


@Injectable()
export class AccountRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async find(params: AccountsDto, userId: string) {
		const where = AccountRepository.search(params)

		console.log(userId)

		where.push(
			eq(accountSchema.userId, userId as any)
		)

		const [data, total] = await Promise.all([
			this.db.select().from(accountSchema).where(and(...where)),
			this.db.select({ total: count(accountSchema.id) }).from(accountSchema).where(
				and(...where)
			)
		])
		return { data, total: total[0]?.total }
	}

	async save(data: AccountEntity): Promise<void> {

		await this.db.transaction(async (tx) => {

			await tx.insert(accountSchema).values(data as any);
			await tx.insert(accountSnapshotSchema).values({ accountId: data.id } as any)
			await tx.insert(accountTenantSnapshotSchema).values({ userId: data.userId } as any)
				.onConflictDoUpdate({
					target: [accountTenantSnapshotSchema.userId], set: {
						userId: sql`excluded."userId"`
					}
				})
		})

	}

	async findByNumber(accountNumber: string): Promise<AccountEntity> {
		const [response] = await this.db
			.select({
				id: accountSchema.id,
				version: accountSchema.version,
				balance: accountSchema.balance,
			})
			.from(accountSchema)
			.where(eq(accountSchema.accountNumber, accountNumber));

		return plainToInstance(AccountEntity, response);
	}
	async findByAccountDetail(params: Partial<AccountEntity>) {

		const where = [];
		for (const [key, value] of Object.entries(params) as [
			keyof {},
			unknown
		][]) {
			where.push(eq(accountSchema[key], value));
		}

		const [response] = await this.db
			.select({
				id: accountSchema.id,
				userId: accountSchema.userId,
				version: accountSchema.version,
				balance: accountSchema.balance,

				accountNumber: accountSchema.accountNumber,

				user: {
					fullName: usersSchema.fullName,
					document: usersSchema.document,
					cellPhone: usersSchema.document,
				}
			})
			.from(accountSchema)
			.innerJoin(usersSchema, eq(usersSchema.id, accountSchema.userId))
			.where(and(...where));

		return response
	}

	static search(params: AccountsDto) {
		const where: any = []

		return where
	}
}
