import { CreateAccountController } from "@controller/account/create-account.controller";
import { Module } from "@nestjs/common";
import { AccountRepository } from "@repository/account.repository";
import { CreateAccountService } from "@service/account/create-account.service";

@Module({
	imports: [],
	controllers: [CreateAccountController],
	providers: [CreateAccountService, AccountRepository],
})
export class AccountModule {}
