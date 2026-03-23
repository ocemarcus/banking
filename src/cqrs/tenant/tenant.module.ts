import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TenantRepository } from "@repository/tenant.repository";
import { CreateTenantHandler } from "./commands/handlers/create-tenant.handler";
import { CreateTenantController } from "./interfaces/create-tenant.controller";

const commands = [CreateTenantHandler];

@Module({
	imports: [CqrsModule],
	controllers: [CreateTenantController],
	providers: [...commands, TenantRepository],
})
export class TenantModule {}
