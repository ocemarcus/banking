import { CreateUsersController } from "@controller/users/create-users.controller";
import { Module } from "@nestjs/common";
import { UsersRepository } from "@repository/users.repository";
import { CreateUsersService } from "@service/users/create-users.service";

@Module({
	imports: [],
	controllers: [CreateUsersController],
	providers: [CreateUsersService, UsersRepository],
})
export class UsersModule {}
