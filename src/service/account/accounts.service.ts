import { AccountsDto } from "@controller/account/dto/accounts.dto";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";

@Injectable()
export class AccountsService {
	constructor(private readonly accountRepository: AccountRepository) {}

	public async execute(params: AccountsDto, userId: string) {
       return await this.accountRepository.find(params, userId)
	}
}
