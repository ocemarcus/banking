import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RollbackTransactionsService } from "@service/transactions/rollback-transactions.service";

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
	async create(@Param('id') transactionId: string, @Request() req: any) {
		return this.transactionsService.execute(transactionId, req.user.sub);
	}
}
