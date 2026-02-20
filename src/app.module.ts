import { DbModule } from "@db/db.module";
import { Module } from "@nestjs/common";
import { AccountModule } from "./modules/account.module";
import { UsersModule } from "./modules/users.module";

@Module({
	imports: [DbModule, AccountModule, UsersModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
