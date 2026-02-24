import { DbModule } from "@db/db.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";
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
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*"); // Apply to all routes
	}
}
