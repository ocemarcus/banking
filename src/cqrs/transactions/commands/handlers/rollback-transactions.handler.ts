import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { generateId } from "@share/generate-id";
import { DailyStatsTransactionsCommand } from "../impl/daily-stats-transactions.command";
import { RollbackTransactionsCommand } from "../impl/rollback-transactions.command";

@CommandHandler(RollbackTransactionsCommand)
export class RollbackTransactionsHandler
	implements ICommandHandler<RollbackTransactionsCommand>
{
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
		private readonly command: CommandBus,
	) {}

	public async execute(command: RollbackTransactionsCommand) {
		const transaction = await this.transactionsRepository.findRollbackDetail(
			command.transactionId,
			command.tenantId,
		);

		if (!transaction?.typeTransaction) {
			throw new HttpException(
				"Transação não encontrada",
				HttpStatus.BAD_REQUEST,
			);
		}

		const validateTransaction = /Out/.test(transaction.typeTransaction);
		if (validateTransaction) {
			throw new HttpException(
				"Tipo de transação inválida para rollback",
				HttpStatus.BAD_REQUEST,
			);
		}

		if (transaction.statusTransaction !== "success") {
			throw new HttpException(
				"Staus da transação inválido",
				HttpStatus.BAD_REQUEST,
			);
		}

		const account = await this.accountRepository.findByAccountDetail({
			accountNumber: transaction.owner.bankAccount,
		});
		if (!account?.id) {
			//Conta sem vículo com banking
			return;
		}
		const newTransaction = {
			id: await generateId(),

			amount: transaction.amount,
			previousBalance: account.balance,
			statusTransaction: "rollback",
			description: "Extorno de transação",

			debitId: transaction.creditId,
			creditId: transaction.debitId,

			accountId: account.id,
			typeTransaction: transaction.typeTransaction,
		} as any;

		const payload = {
			transaction: newTransaction,
			accountDestination: {
				accountId: account.id,
				version: +account.version,
			},
			accountOrigin: {
				accountId: transaction.account.id,
				version: +transaction.account.version,
			},
		};
		await this.transactionsRepository.rollback(payload);

		this.command.execute(
			new DailyStatsTransactionsCommand(
				+transaction.amount,
				command.tenantId,
				payload.accountOrigin.accountId.toString(),
				payload.accountDestination.accountId.toString(),
			),
		);
	}
}
