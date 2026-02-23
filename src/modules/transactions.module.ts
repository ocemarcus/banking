import { AuthModule } from "@auth/auth.module";
import { CreateTransactionsController } from "@controller/transactions/create-transactions.controller";
import { P2PTransactionsController } from "@controller/transactions/p2p-transactions.controller";
import { RollbackTransactionsController } from "@controller/transactions/rollback-transactions.controller";
import { TransactionsController } from "@controller/transactions/transations.controller";
import { Module } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { UsersRepository } from "@repository/users.repository";
import { CreateTransactionsService } from "@service/transactions/create-transactions.service";
import { P2PTransactionsService } from "@service/transactions/p2p-transactions.service";
import { RollbackTransactionsService } from "@service/transactions/rollback-transactions.service";
import { TransactionsService } from "@service/transactions/transactions.serivce";

@Module({
	imports: [
		AuthModule
	],
	controllers: [CreateTransactionsController, RollbackTransactionsController, P2PTransactionsController, TransactionsController],
	providers: [
		RollbackTransactionsService,
		CreateTransactionsService,
		TransactionsRepository,
		AccountRepository,
		UsersRepository,
		P2PTransactionsService,
		TransactionsService,
	],
})
export class TransactionsModule {}
