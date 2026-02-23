import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema } from "@db/schema/account.schema";
import { AccountEntity } from "@entity/account.entity";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { eq } from "drizzle-orm";




@Injectable()
export class AccountRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async save(data: AccountEntity): Promise<void> {
	 await	this.db.insert(accountSchema).values(data as any)
	}

	async findByNumber(accountNumber: string): Promise<AccountEntity> {

		const [response] = await this.db.select({
			id: accountSchema.id,
			version: accountSchema.version,
			balance: accountSchema.balance,
		}).from(accountSchema).where(
			eq(accountSchema.accountNumber, accountNumber),
		)

		return plainToInstance(AccountEntity, response)
	}

}
