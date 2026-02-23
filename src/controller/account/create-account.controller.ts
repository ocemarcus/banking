import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateAccountService } from "@service/account/create-account.service";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { CreateAccountDto } from "./dto/account-uses.dto";

@Controller("/account")
	@ApiBearerAuth()
export class CreateAccountController {
	constructor(private readonly accountService: CreateAccountService) {}

	@Post()
	@ApiOperation({
		summary: "Criar nova conta",
		description: "Api para criação da conta bancária",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Body() data: CreateAccountDto) {
		return this.accountService.execute(data);
	}
}
