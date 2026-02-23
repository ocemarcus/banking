import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateAccountService } from "@service/account/create-account.service";
import { CreateAccountDto } from "./dto/account-uses.dto";

@Controller("/account")
	@ApiBearerAuth()
export class CreateAccountController {
	constructor(private readonly accountService: CreateAccountService) {}

	@Post()
	@ApiOperation({ summary: 'Criar nova conta', description: 'Api para criação da conta bancária' })
	async create(@Body() data: CreateAccountDto) {
		return this.accountService.execute(data);
	}
}
