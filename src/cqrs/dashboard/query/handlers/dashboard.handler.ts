import { ICommandHandler, QueryHandler } from "@nestjs/cqrs";
import { DashboardRepository } from "@repository/dashboard.repository";
import { DashboardQueryBus } from "../impl/dashboard.query";

@QueryHandler(DashboardQueryBus)
export class DashboardHandler implements ICommandHandler<DashboardQueryBus> {
	constructor(private readonly dashboardRepository: DashboardRepository) {}

	public async execute(command: DashboardQueryBus): Promise<any> {
		return  this.dashboardRepository.balance(command.userId)
	}
}
