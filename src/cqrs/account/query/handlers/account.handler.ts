import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { AccountQueryCommand } from "../impl/account.command";

@QueryHandler(AccountQueryCommand)
export class AccountHandler implements IQueryHandler<AccountQueryCommand> {
	constructor(private readonly accountRepository: AccountRepository) {}

	public async execute(command: AccountQueryCommand) {
        return await this.accountRepository.find(command.params, command.userId)
    }
}
