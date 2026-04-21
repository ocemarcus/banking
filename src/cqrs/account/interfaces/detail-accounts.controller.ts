import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { DetailAccountQueryCommand } from "../query/impl/detail-account.command";

@ApiBearerAuth()
@ApiTags("account")
@Controller("/account")
export class DetailAccountsController {
	constructor(private readonly query: QueryBus) {}

	@Get("detail/:accountNumber")
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Listar informações da conta",
		description: "Api para listar informações da conta",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Param("accountNumber") accountNumber: string, @Request() req: any) {
		const userId = req.user.id;
		return await this.query.execute(new DetailAccountQueryCommand(userId, accountNumber));
	}
}
