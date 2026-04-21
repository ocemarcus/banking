import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOperation } from "@nestjs/swagger";
import { CreateTenantCommand } from "../commands/impl/create-tenant.command";
import { CreateTenantDto } from "./dto/create-tenant.dto";

@Controller("/tenant")
export class CreateTenantController {
	constructor(private readonly command: CommandBus) {}

	@Post()
	@ApiOperation({
		summary: "Criar novo tenant",
		description: "Api para criação de tenant",
	})
	async create(@Body() data: CreateTenantDto) {
		return this.command.execute(
			new CreateTenantCommand(
				data.email,
				data.fullName,
				data.cellPhone,
				data.document,
			),
		);
	}
}
