import { CreateAccountDto } from "@controller/account/dto/account-uses.dto";
import { AccountEntity } from "@entity/account.entity";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { uuidV7 } from "@share/uuidV7";
import { plainToInstance } from "class-transformer";

@Injectable()
export class CreateAccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

	public async execute(data: CreateAccountDto) {
		const id = await uuidV7();

		const account = plainToInstance(AccountEntity, {
			id,
			balance: 0,
			version: 1,
			userId: data.userId,
			accountType: data.accountType,
			accountNumber: data.document,
		});
		await this.accountRepository.save(account);
	}
}
