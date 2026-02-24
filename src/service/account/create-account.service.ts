import { CreateAccountDto } from "@controller/account/dto/account-uses.dto";
import { AccountEntity } from "@entity/account.entity";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { uuidV7 } from "@share/uuidV7";
import { plainToInstance } from "class-transformer";

@Injectable()
export class CreateAccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

	public async execute(data: CreateAccountDto, userId: string) {
		const id = await uuidV7();

		const account = plainToInstance(AccountEntity, {
			id,
			userId,
			balance: 0,
			version: 1,
			accountNumber: data.document,
			accountType: data.accountType,
		});


		await this.accountRepository.save(account);

		console.log('xxxxxfddd')
	}
}
