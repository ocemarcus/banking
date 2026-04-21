import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SalesWebHookCommand } from "../impl/sales-webhook.command";

@CommandHandler(SalesWebHookCommand)
export class SalesWebhookHandler implements ICommandHandler<SalesWebHookCommand> {
    public async execute(command: SalesWebHookCommand) {
        console.log(command)
    }
}