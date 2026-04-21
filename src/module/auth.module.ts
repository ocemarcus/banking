import { AuthController } from "@controller/auth/auth.controller";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersRepository } from "@repository/users.repository";
import { AuthService } from "@service/auth/auth.service";

@Module({
	imports: [
	JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2m' },
    }),
	],
	controllers: [AuthController],
	providers: [UsersRepository, AuthService],
})
export class AuthModule {}