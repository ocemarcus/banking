import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { DetailAccountQueryCommand } from "../impl/detail-account.command";

@QueryHandler(DetailAccountQueryCommand)
export class DetailAccountHandler
	implements IQueryHandler<DetailAccountQueryCommand>
{
	constructor(private readonly accountRepository: AccountRepository) {}

	public async execute(command: DetailAccountQueryCommand) {
		const response =  await this.accountRepository.findByAccountDetail({accountNumber: command.accountNumber})

		return {...response, balance: undefined, version: undefined}
	}
}
