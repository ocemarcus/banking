import { UsersModule } from "@cqrs/users/users.module";
import { DbModule } from "@db/db.module";
import { AccountModule } from "@module/account.module";
import { AuthModule } from "@module/auth.module";
import { TransactionsModule } from "@module/transactions.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";

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
