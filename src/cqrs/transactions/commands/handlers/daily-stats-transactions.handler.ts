import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DailyStatsTransactionsRepository } from "@repository/daily-stats-transactions.repository";
import { DailyStatsTransactionsCommand } from "../impl/daily-stats-transactions.command";

@CommandHandler(DailyStatsTransactionsCommand)
export class DailyStatsTransactionsHandler
	implements ICommandHandler<DailyStatsTransactionsCommand>
{
	constructor(
		private readonly dailyStatsTransactionsRepository: DailyStatsTransactionsRepository,
	) {}
	public async execute(command: DailyStatsTransactionsCommand) {
		await this.dailyStatsTransactionsRepository.dailyStatsP2P(command);
	}
}
