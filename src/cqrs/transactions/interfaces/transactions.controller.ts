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
import { TransactionsQueryCommand } from "../query/impl/transactions.command";
import { TransactionsSwaggerResponse } from "./doc/transactions.doc";
import { TransactionsDto } from "./dto/transactions.dto";

@ApiBearerAuth()
@ApiTags("transactions")
@Controller("/transactions")
export class TransactionsController {
	constructor(private readonly query: QueryBus) {}

	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Listar transações",
		description: "Api para tranferência entre contas",
	})
	@ApiResponse(TransactionsSwaggerResponse)
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Query() params: TransactionsDto, @Request() req: any) {
		const tenantId = req.user.sub;
		return await this.query.execute(
			new TransactionsQueryCommand(tenantId, params),
		);
	}
}
