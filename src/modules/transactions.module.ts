import { AuthModule } from "@auth/auth.module";
import { CreateTransactionsController } from "@controller/transactions/create-transactions.controller";
import { RollbackTransactionsController } from "@controller/transactions/rollback-transactions.controller";
import { Module } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { UsersRepository } from "@repository/users.repository";
import { CreateTransactionsService } from "@service/transactions/create-transactions.service";
import { RollbackTransactionsService } from "@service/transactions/rollback-transactions.service";

@Module({
	imports: [
		AuthModule
	],
	controllers: [CreateTransactionsController, RollbackTransactionsController],
	providers: [
		RollbackTransactionsService,
		CreateTransactionsService,
		TransactionsRepository,
		AccountRepository,
		UsersRepository,
	],
})
export class TransactionsModule {}
