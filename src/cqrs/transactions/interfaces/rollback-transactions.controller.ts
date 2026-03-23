import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { RollbackTransactionsCommand } from "../commands/impl/rollback-transactions.command";

@ApiBearerAuth()
@ApiTags('transactions')
@Controller("/transactions/:id/rollback")
export class RollbackTransactionsController {

	constructor(private readonly command: CommandBus) { }

	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Devolver transaferência",
		description: "Api para devolver transferência",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Param('id') transactionId: string, @Request() req: any) {
		const tenantId = req.user.sub
		return await this.command.execute(new RollbackTransactionsCommand(transactionId, tenantId))
	}
}
