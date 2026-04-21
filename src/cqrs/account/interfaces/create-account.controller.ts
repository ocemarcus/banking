import { AuthGuard } from "@auth/auth.guard";
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateAccountService } from "@service/account/create-account.service";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { CreateAccountDto } from "./dto/account-uses.dto";

@Controller("/account")
	@ApiTags('account')
	@ApiBearerAuth()
export class CreateAccountController {
	constructor(private readonly accountService: CreateAccountService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Criar nova conta",
		description: "Api para criação da conta bancária",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Body() data: CreateAccountDto, @Request() req: any) {

		return this.accountService.execute(data, req.user.sub);
	}
}
