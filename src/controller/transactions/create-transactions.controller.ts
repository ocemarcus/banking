import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTransactionsService } from "@service/transactions/create-transactions.service";
import { CreateTransactionsDto } from "./dto/create-transactions.dto";

@ApiTags("transactions")
@Controller("/transactions")
export class CreateTransactionsController {
	constructor(
		private readonly transactionsService: CreateTransactionsService,
	) { }

	@Post()
	@ApiOperation({
		summary: "Criar nova transaferência",
		description: "Api para adicionar saldo em conta",
	})
	async create(@Body() data: CreateTransactionsDto) {
		return this.transactionsService.execute(data);
	}
}
