import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DashboardRepository } from "@repository/dashboard.repository";
import { DashboardController } from "./interfaces/dashboard.controller";
import { DashboardHandler } from "./query/handlers/dashboard.handler";

const commands = [DashboardHandler];

@Module({
	imports: [CqrsModule],
	controllers: [DashboardController],
	providers: [...commands, DashboardRepository],
})
export class DashboardModule {}
