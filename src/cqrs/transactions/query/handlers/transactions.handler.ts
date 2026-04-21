import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TransactionsRepository } from "@repository/transactions.repository";
import { TransactionsQueryCommand } from "../impl/transactions.command";

@QueryHandler(TransactionsQueryCommand)
export class TransactionsHandler
	implements IQueryHandler<TransactionsQueryCommand>
{
	constructor(
		private readonly transactionsRepository: TransactionsRepository,
	) {}

	public async execute(command: TransactionsQueryCommand) {
		return await this.transactionsRepository.find(command.params, command.tenantId)
    }
}
