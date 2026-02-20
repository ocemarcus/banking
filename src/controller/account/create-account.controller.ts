import { Body, Controller, Post } from "@nestjs/common";
import { CreateAccountService } from "@service/account/create-account.service";
import { CreateAccountDto } from "./dto/account-uses.dto";

@Controller("/account")
export class CreateAccountController {
	constructor(private readonly accountService: CreateAccountService) {}

	@Post()
	async create(@Body() data: CreateAccountDto) {
		return this.accountService.execute(data);
	}
}
