import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { tenantSchema } from "@db/schema/tenant.schema";
import { usersSchema } from "@db/schema/users.schema";
import { TenantEntity } from "@entity/tenant.entity";
import { UsersEntity } from "@entity/users.entity";
import { Injectable } from "@nestjs/common";


export type CreateTenant = {
	  data: TenantEntity,
	  users: UsersEntity
}


@Injectable()
export class TenantRepository {
	constructor(@InjectDb() private readonly db: DB) {}

	async save(data: CreateTenant): Promise<void> {
		await this.db.transaction(async(tx) => {
		  await tx.insert(tenantSchema).values(data.data as any)
		  await tx.insert(usersSchema).values(data.users as any)
		})
	}
}
