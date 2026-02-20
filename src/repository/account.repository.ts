import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountSchema } from "@db/schema/account.schema";
import { AccountEntity } from "@entity/account.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async save(data: AccountEntity): Promise<void> {
	 await	this.db.insert(accountSchema).values(data as any)
	}
}
