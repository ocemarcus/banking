import { CreateUsersController } from "@cqrs/users/interfaces/create-users.controller";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersRepository } from "@repository/users.repository";
import { CreateUsersHandler } from "./commands/handlers/create-users.handler";


const commands = [CreateUsersHandler];

@Module({
	imports: [CqrsModule],
	controllers: [CreateUsersController],
	providers: [UsersRepository, ...commands],
})
export class UsersModule {}
