import { AccountModule } from "@cqrs/account/account.module";
import { DashboardModule } from "@cqrs/dashboard/dashboard.module";
import { TransactionsModule } from "@cqrs/transactions/transactions.module";
import { UsersModule } from "@cqrs/users/users.module";
import { DbModule } from "@db/db.module";
import { AuthModule } from "@module/auth.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
	imports: [
		DbModule,
		UsersModule,
		AuthModule,
		AccountModule,
		TransactionsModule,
		DashboardModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*"); // Apply to all routes
	}
}
