import { Body, Controller, Post } from "@nestjs/common";
import { CreateTransactionsService } from "@service/transactions/create-transactions.service";
import { CreateTransactionsDto } from "./dto/create-transactions.dto";

@Controller("/transactions")
export class CreateTransactionsController {
	constructor(private readonly transactionsService: CreateTransactionsService ) {}

	@Post()
	async create(@Body() data: CreateTransactionsDto) {
		return this.transactionsService.execute(data);
	}
}
