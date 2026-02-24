import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AccountsService } from "@service/account/accounts.service";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { AccountSwaggerResponse } from "./doc/accounts.doc";
import { AccountsDto } from "./dto/accounts.dto";

@Controller("/account")
@ApiTags("account")
@ApiBearerAuth()
export class AccountsController {
	constructor(private readonly accountService: AccountsService) {}

	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Listar contas",
		description: "Api para listar contas bancária",
	})
	@ApiResponse(AccountSwaggerResponse)
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Query() params: AccountsDto, @Request() req: any) {
		return this.accountService.execute(params, req.user.sub);
	}
}
