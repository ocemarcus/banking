import { AuthGuard } from "@auth/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { DashboardQueryBus } from "../query/impl/dashboard.query";
import { DashboardDto } from "./dto/dashboard.dto";

@Controller("/dashboard")
@ApiBearerAuth()
export class DashboardController {
	constructor(private readonly command: QueryBus) {}

	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: "Informações do saldo",
		description: "Listar informações do saldo",
	})
	async create(@Query() params: DashboardDto, @Req() req: any) {
		const userId = req.user.sub;
		return await this.command.execute(new DashboardQueryBus(userId));
	}
}
