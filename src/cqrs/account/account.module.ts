import { CreateAccountController } from "@controller/account/create-account.controller";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AccountRepository } from "@repository/account.repository";
import { CreateAccountService } from "@service/account/create-account.service";
import { AccountsController } from "./interfaces/accounts.controller";
import { DetailAccountsController } from "./interfaces/detail-accounts.controller";
import { AccountHandler } from "./query/handlers/account.handler";
import { DetailAccountHandler } from "./query/handlers/detail-account.handler";

const commands = [AccountHandler, DetailAccountHandler];

@Module({
	imports: [CqrsModule],
	controllers: [
		CreateAccountController,
		AccountsController,
		DetailAccountsController,
	],
	providers: [AccountRepository, ...commands, CreateAccountService],
})
export class AccountModule {}
