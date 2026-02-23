import { AuthGuard } from "@auth/auth.guard";
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { P2PTransactionsService } from "@service/transactions/p2p-transactions.service";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { P2PTransactionsDto } from "./dto/p2p-transactions.dto";

@Controller("/transactions/p2p")
@ApiBearerAuth()
	@ApiTags("transactions")
export class P2PTransactionsController {
	constructor(private readonly transactionsService: P2PTransactionsService) { }

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Tranferência entre contas",
		description: "Api para tranferência entre contas",
	})
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Body() data: P2PTransactionsDto, @Request() req: any) {
		return this.transactionsService.execute(data, req.user.sub);
	}
}
