import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { TransactionsService } from "@service/transactions/transactions.serivce";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { TransactionsSwaggerResponse } from "./doc/transactions.doc";
import { TransactionsDto } from "./dto/transations.dto";

@ApiBearerAuth()
@ApiTags("transactions")
@Controller("/transactions")
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

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
		return this.transactionsService.execute(params, req.user.sub);
	}
}
