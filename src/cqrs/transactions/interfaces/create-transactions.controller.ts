import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTransactionsCommand } from "../commands/impl/create-transactions.command";
import { CreateTransactionsDto } from "./dto/create-transactions.dto";

@ApiTags("transactions")
@Controller("/transactions")
export class CreateTransactionsController {
	constructor(private readonly command: CommandBus) {}

	@Post()
	@ApiOperation({
		summary: "Criar nova transaferência",
		description: "Api para adicionar saldo em conta",
	})
	async create(@Body() data: CreateTransactionsDto) {
		await this.command.execute(new CreateTransactionsCommand(data));
	}
}
