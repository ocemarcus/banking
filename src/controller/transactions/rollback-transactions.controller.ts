import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { RollbackTransactionsService } from "@service/transactions/rollback-transactions.service";

@Controller("/transactions/:id/rollback")
export class RollbackTransactionsController {
	constructor(
		private readonly transactionsService: RollbackTransactionsService,
	) {}

	@Get()
	@UseGuards(AuthGuard)
	async create(@Param('id') transactionId: string, @Request() req: any) {
		return this.transactionsService.execute(transactionId, req.user.sub);
	}
}
