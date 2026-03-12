import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { generateId } from "@share/generate-id";
import { P2PProcessTransactionCommand } from "../impl/p2p-proccess-transaction.command";
import { P2PTransactionCommand } from "../impl/p2p-transaction.command";

@CommandHandler(P2PTransactionCommand)
export class P2PTransactionsHandler
	implements ICommandHandler<P2PTransactionCommand>
{
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
		private readonly command: CommandBus,
	) {}

	public async execute(command: P2PTransactionCommand) {
		const account = await this.accountRepository.findByAccountDetail({
			userId: command.userId,
			id: command.accountOriginId,
		});

		if (!account?.id) {
			throw new HttpException("Conta não encontrada", HttpStatus.BAD_REQUEST);
		}

		if (command.amount < 0) {
			throw new HttpException(
				"Valor deve ser maior que 0",
				HttpStatus.BAD_REQUEST,
			);
		}
		if (command.amount > +account.balance) {
			throw new HttpException(
				"Valor deve ser menor ou igual do saldo",
				HttpStatus.BAD_REQUEST,
			);
		}

		const debitOwnerId = await generateId();
		const debitOwner = {
			bankName: "AC",
			id: debitOwnerId,
			fullName: account.user.fullName,
			cellPhone: account.user.cellPhone,
			document: account.user.document,
			bankAccount: account.accountNumber,
		} as any;

		const debitId =
			await this.transactionsRepository.findOwnerOrSave(debitOwner);

		const accountDestination = await this.accountRepository.findByAccountDetail(
			{ id: command.accountDestinationId },
		);

		if (!accountDestination?.id) {
			throw new HttpException("Conta não encontrada", HttpStatus.BAD_REQUEST);
		}

		const creditOwnerId = await generateId();

		const creditOwner = {
			bankName: "AC",
			id: creditOwnerId,
			document: accountDestination.user.document,
			fullName: accountDestination.user.fullName,
			cellPhone: accountDestination.user.cellPhone,
			bankAccount: accountDestination.accountNumber,
		} as any;

		const creditId =
			await this.transactionsRepository.findOwnerOrSave(creditOwner);

		const transaction = {
			id: await generateId(),
			debitId,
			creditId,
			amount: command.amount,
			statusTransaction: "pending",

			accountId: account.id,
			accountVersion: account.version,
			previousBalance: account.balance,
			typeTransaction: "transferInternalOut",
		} as any;
		await this.transactionsRepository.saveP2P(transaction);

		this.command.execute(
			new P2PProcessTransactionCommand(
				command.userId,
				transaction,
				command.accountOriginId,
				command.accountDestinationId,
			),
		);
	}
}
