import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { usersSchema } from "@db/schema/users.schema";
import { UsersEntity } from "@entity/users.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async save(data: UsersEntity): Promise<void> {
		 await this.db.insert(usersSchema).values(data as any)
	}
}
