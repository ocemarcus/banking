import { AccountModule } from "@cqrs/account/account.module";
import { DashboardModule } from "@cqrs/dashboard/dashboard.module";
import { SalesModule } from "@cqrs/sales/sales.module";
import { TenantModule } from "@cqrs/tenant/tenant.module";
import { TransactionsModule } from "@cqrs/transactions/transactions.module";
import { UsersModule } from "@cqrs/users/users.module";
import { WebHookModule } from "@cqrs/webhook/webhook.modulo";
import { DbModule } from "@db/db.module";
import { AuthModule } from "@module/auth.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
	imports: [
		DbModule,
		TenantModule,
		AuthModule,
		UsersModule,
		AccountModule,
		TransactionsModule,
		DashboardModule,
		WebHookModule,
		SalesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*"); // Apply to all routes
	}
}
