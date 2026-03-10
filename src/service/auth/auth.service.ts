


import { AuthDto } from "@controller/auth/dto/auth.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "@repository/users.repository";
import { Password } from "@share/password";

@Injectable()
export class AuthService {
	constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        
    ) {}

	public async execute(data: AuthDto) {
		 
        const user = await this.usersRepository.findByEmail(data.email)

        if(!user?.email) {
             throw new UnauthorizedException();
        }

        const passwordMatch = Password.compare(user.password, data.password);
		if (!passwordMatch) {
             throw new UnauthorizedException();
		}
        user.id = user.id.toString()

        const payload = {
            sub: user.id,
            username: user.fullName,
            
        }
        const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' })

        return {
            ...user,
            token,
            password: undefined,
        }

	}
}