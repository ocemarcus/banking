import { AuthGuard } from "@auth/auth.guard";
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { P2PTransactionCommand } from "../commands/impl/p2p-transaction.command";
import { P2PTransactionsDto } from "./dto/p2p-transactions.dto";

@ApiBearerAuth()
@ApiTags("transactions")
@Controller("/transactions/p2p")
export class P2PTransactionsController {
	constructor(private readonly command: CommandBus) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Tranferência entre contas",
		description: "Api para tranferência entre contas",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Body() data: P2PTransactionsDto, @Request() req: any) {
		const userId = req.user.sub
		return await this.command.execute(new P2PTransactionCommand(userId, data.amount, data.accountOriginId, data.accountDestinationId))
	}
}
