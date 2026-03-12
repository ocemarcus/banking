import { UsersEntity } from "@entity/users.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "@repository/users.repository";
import { generateId } from "@share/generate-id";
import { Password } from "@share/password";
import { plainToInstance } from "class-transformer";
import { CreateUsersCommand } from "../impl/create-users.command";

@CommandHandler(CreateUsersCommand)
export class CreateUsersHandler implements ICommandHandler<CreateUsersCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	public async execute(command: CreateUsersCommand): Promise<void> {
		const userId = await generateId();

		const user = plainToInstance(UsersEntity, {
			...command.data,
			id: userId,
			password: Password.hashPassword(command.data.password),
		});

		await this.usersRepository.save(user);
	}
}
