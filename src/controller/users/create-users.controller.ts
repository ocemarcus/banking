import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateUsersService } from "@service/users/create-users.service";
import { CreateUsersDto } from "./dto/create-users.dto";

@Controller("/users")
export class CreateUsersController {
	constructor(private readonly accountService: CreateUsersService) {}

	@Post()
	@ApiOperation({
		summary: "Criar novo usuário",
		description: "Api para criação do usuário",
	})
	async create(@Body() data: CreateUsersDto) {
		return this.accountService.execute(data);
	}
}
