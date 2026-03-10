import { UsersDto } from "@cqrs/users/interfaces/dto/users.dto";


export class CreateUsersCommand  {
    constructor(
        public readonly data: UsersDto,
        
    ) {
    }
}