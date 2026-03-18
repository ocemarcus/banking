import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountTenantSnapshotSchema } from "@db/schema/account.schema";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";



@Injectable()
export class DashboardRepository {
     constructor(@InjectDb() private readonly db: DB) {}

    public async balance(userId: string) {

        const [response] = await this.db.select()
            .from(accountTenantSnapshotSchema)
        .where(
            eq(accountTenantSnapshotSchema.userId, BigInt(userId))
        )
        return response
    }
}