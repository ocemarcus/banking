import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { generateId } from "@share/generate-id";
import { DailyStatsTransactionsCommand } from "../impl/daily-stats-transactions.command";
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

		const transactions = [
			{
				id: await generateId(),

				accountId: account.id,
				previousBalance: account.balance,
				typeTransaction: "transferInternalOut",
			},
			{
				id: await generateId(),
				accountId: accountDestination.id,
				previousBalance: accountDestination.balance,
				typeTransaction: "transferInternalIn",
			},
		] as any;

		const payload = {
			transactions: transactions.map((item: any) => ({
				...item,

				debitId,
				creditId,
				amount: command.amount,
				statusTransaction: "success",
			})),
			accountOrigin: {
				accountId: account.id,
				version: +account.version,
			},
			accountDestination: {
				accountId: accountDestination.id,
				version: +accountDestination.version,
			},
		} as any;
		await this.transactionsRepository.saveP2P(payload);

		this.command.execute(
			new DailyStatsTransactionsCommand(
				command.amount,
				account.id.toString(),
				accountDestination.id.toString(),
			),
		);
	}
}
