import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "@service/auth/auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@ApiOperation({
		summary: "Fazer login na api",
		description: "Api para autencicar usuário",
	})
	async create(@Body() data: AuthDto) {
		return this.authService.execute(data);
	}
}
