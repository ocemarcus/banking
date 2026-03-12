import type { DB } from "@db/db.client";
import { InjectDb } from "@db/db.provider";
import { accountUsersSnapshotSchema } from "@db/schema/account.schema";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";



@Injectable()
export class DashboardRepository {
     constructor(@InjectDb() private readonly db: DB) {}

    public async balance(userId: string) {

        const [response] = await this.db.select()
            .from(accountUsersSnapshotSchema)
        .where(
            eq(accountUsersSnapshotSchema.userId, BigInt(userId))
        )
        return response
    }
}