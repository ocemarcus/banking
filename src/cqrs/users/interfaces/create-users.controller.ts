import { AuthGuard } from "@auth/auth.guard";
import { CreateUsersCommand } from "@cqrs/users/commands/impl/create-users.command";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SwaggerError400, SwaggerError401 } from "@share/swagger";
import { CreateUsersDto } from "./dto/create-users.dto";

@ApiBearerAuth()
@Controller("/users")
export class CreateUsersController {
	constructor(private readonly command: CommandBus) { }

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Criar novo usuário",
		description: "Api para criação do usuário",
	})
	@ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
	@ApiResponse(SwaggerError400)
	@ApiResponse(SwaggerError401)
	async create(@Body() data: CreateUsersDto) {
		return this.command.execute(new CreateUsersCommand(data));
	}
}
