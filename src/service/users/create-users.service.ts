import { CreateUsersDto } from "@cqrs/users/interfaces/dto/create-users.dto";
import { UsersEntity } from "@entity/users.entity";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "@repository/users.repository";
import { generateId } from "@share/generate-id";
import { Password } from "@share/password";
import { plainToInstance } from "class-transformer";

@Injectable()
export class CreateUsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	public async execute(data: CreateUsersDto) {
		const userId = await generateId();

		const user = plainToInstance(UsersEntity, {
			...data,
			id: userId,
			password: Password.hashPassword(data.password),
		});

		await this.usersRepository.save(user)

	}
}
