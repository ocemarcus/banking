import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { TransactionsRepository } from "@repository/transactions.repository";
import { generateId } from "@share/generate-id";
import { DailyStatsTransactionsCommand } from "../impl/daily-stats-transactions.command";
import { P2PProcessTransactionCommand } from "../impl/p2p-proccess-transaction.command";

@CommandHandler(P2PProcessTransactionCommand)
export class P2PProcessTransactionsHandler
	implements ICommandHandler<P2PProcessTransactionCommand>
{
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly accountRepository: AccountRepository,
		private readonly command: CommandBus,
	) {}

	public async execute(command: P2PProcessTransactionCommand) {
		const originalTransactionId = command.transaction.id;

		command.transaction.id = await generateId();
		command.transaction.statusTransaction = "success";
		command.transaction.typeTransaction = "transferInternalIn";
		command.transaction.accountId = command.accountDestinationId;

		const account = await this.accountRepository.findByAccountDetail({
			id: command.accountDestinationId,
		});

		await this.transactionsRepository.save({
			transaction: command.transaction,
			account: {
				accountId: account.id,
				version: +account.version,
			},
		});
		this.command.execute(
			new DailyStatsTransactionsCommand(
				command.transaction.amou,
				account.userId!.toString(),
				command.accountOriginId,
				command.accountDestinationId,
			),
		);
	}
}
