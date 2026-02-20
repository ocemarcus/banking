import { Body, Controller, Post } from "@nestjs/common";
import { CreateUsersService } from "@service/users/create-users.service";
import { CreateUsersDto } from "./dto/create-users.dto";

@Controller("/users")
export class CreateUsersController {
	constructor(private readonly accountService: CreateUsersService) {}

	@Post()
	async create(@Body() data: CreateUsersDto) {
		return this.accountService.execute(data);
	}
}
