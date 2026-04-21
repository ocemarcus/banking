import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { SalesWebHookCommand } from "../commands/impl/sales-webhook.command";

@Controller("/webhook")
export class SalesWebhookController {
	constructor(private readonly command: CommandBus) {}

	@Post("sales")
	async create(@Body() data: any) {
		await this.command.execute(new SalesWebHookCommand(data));
	}
}
