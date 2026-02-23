import { DbModule } from "@db/db.module";
import { Module } from "@nestjs/common";
import { AccountModule } from "./modules/account.module";
import { AuthModule } from "./modules/auth.module";
import { TransactionsModule } from "./modules/transactions.module";
import { UsersModule } from "./modules/users.module";

@Module({
	imports: [
		DbModule,
		UsersModule,
		AuthModule,
		AccountModule,
		TransactionsModule,

	],
	controllers: [],
	providers: [],
})
export class AppModule {}
