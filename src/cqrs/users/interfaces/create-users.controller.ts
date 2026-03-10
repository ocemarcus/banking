import { CreateUsersCommand } from "@cqrs/users/commands/impl/create-users.command";
import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOperation } from "@nestjs/swagger";
import { CreateUsersDto } from "./dto/create-users.dto";

@Controller("/users")
export class CreateUsersController {
	constructor(private readonly command: CommandBus) { }

	@Post()
	@ApiOperation({
		summary: "Criar novo usuário",
		description: "Api para criação do usuário",
	})
	async create(@Body() data: CreateUsersDto) {
		return this.command.execute(
			new CreateUsersCommand(
			   data	
			),
		);
	}
}
