import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RollbackTransactionsService } from "@service/transactions/rollback-transactions.service";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";

@Controller("/transactions/:id/rollback")
@ApiBearerAuth()
@ApiTags('transactions')
export class RollbackTransactionsController {
	constructor(
		private readonly transactionsService: RollbackTransactionsService,
	) {}

	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Devolver transaferência",
		description: "Api para devolver transferência",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Param('id') transactionId: string, @Request() req: any) {
		return this.transactionsService.execute(transactionId, req.user.sub);
	}
}
