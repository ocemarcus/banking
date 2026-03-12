import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { AccountsController } from "./interfaces/accounts.controller";
import { DetailAccountsController } from "./interfaces/detail-accounts.controller";
import { AccountHandler } from "./query/handlers/account.handler";
import { DetailAccountHandler } from "./query/handlers/detail-account.handler";

const commands = [AccountHandler, DetailAccountHandler];

@Module({
	imports: [CqrsModule],
	controllers: [AccountsController, DetailAccountsController],
	providers: [AccountRepository, ...commands],
})
export class AccountModule {}
