import { AccountsController } from "@controller/account/accounts.controller";
import { CreateAccountController } from "@controller/account/create-account.controller";
import { Module } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { AccountsService } from "@service/account/accounts.service";
import { CreateAccountService } from "@service/account/create-account.service";

@Module({
	imports: [],
	controllers: [CreateAccountController, AccountsController],
	providers: [CreateAccountService, AccountsService, AccountRepository],
})
export class AccountModule {}
