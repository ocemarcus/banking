import { AuthModule } from "@auth/auth.module";
import { P2PTransactionsController } from "@cqrs/transactions/interfaces/p2p-transactions.controller";
import { RollbackTransactionsController } from "@cqrs/transactions/interfaces/rollback-transactions.controller";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { DailyStatsTransactionsRepository } from "@repository/daily-stats-transactions.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { UsersRepository } from "@repository/users.repository";
import { CreateTransactionsHandler } from "./commands/handlers/create-transactions.handler";
import { DailyStatsTransactionsHandler } from "./commands/handlers/daily-stats-transactions.handler";
import { P2PTransactionsHandler } from "./commands/handlers/p2p-transaction.handler";
import { RollbackTransactionsHandler } from "./commands/handlers/rollback-transactions.handler";
import { CreateTransactionsController } from "./interfaces/create-transactions.controller";
import { TransactionsController } from "./interfaces/transactions.controller";
import { TransactionsHandler } from "./query/handlers/transactions.handler";

const commands = [
	TransactionsHandler,
	P2PTransactionsHandler,
	CreateTransactionsHandler,
	DailyStatsTransactionsHandler,
	RollbackTransactionsHandler,
];

@Module({
	imports: [CqrsModule, AuthModule],
	controllers: [
		CreateTransactionsController,
		TransactionsController,
		P2PTransactionsController,
		RollbackTransactionsController,
	],
	providers: [
		TransactionsRepository,
		AccountRepository,
		UsersRepository,
		DailyStatsTransactionsRepository,
		...commands,
	],
})
export class TransactionsModule {}
