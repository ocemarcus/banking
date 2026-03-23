import { TenantEntity } from "@entity/tenant.entity";
import { UsersEntity } from "@entity/users.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TenantRepository } from "@repository/tenant.repository";
import { generateId } from "@share/generate-id";
import { Password } from "@share/password";
import { plainToInstance } from "class-transformer";
import { CreateTenantCommand } from "../impl/create-tenant.command";

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler
	implements ICommandHandler<CreateTenantCommand>
{
	constructor(private readonly tenantRepository: TenantRepository) {}

	public async execute(command: CreateTenantCommand): Promise<void> {
		const tenantId = await generateId();

		const payload = plainToInstance(TenantEntity, {
			id: tenantId,
			...command,
		});


		const users = plainToInstance(UsersEntity, {
			...command,
			tenantId,
			id: tenantId,
			password: Password.hashPassword("323232"),
		});

		await this.tenantRepository.save({
			users,
			data: payload,
		});
	}
}
