import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { AccountQueryCommand } from "../query/impl/account.command";
import { AccountSwaggerResponse } from "./doc/accounts.doc";
import { AccountsDto } from "./dto/accounts.dto";

@ApiBearerAuth()
@ApiTags("account")
@Controller("/account")
export class AccountsController {
	constructor(private readonly query: QueryBus) {}

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
		const userId = req.user.sub;
		return await this.query.execute(new AccountQueryCommand(userId, params));
	}
}
