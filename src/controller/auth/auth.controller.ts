import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "@service/auth/auth.service";
import { AuthSwaggerResponse } from "./doc/auth.doc";
import { AuthDto } from "./dto/auth.dto";

@Controller("/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@ApiOperation({
		summary: "Fazer login na api",
		description: "Api para autencicar usuário",
	})
	@ApiResponse(AuthSwaggerResponse)
	async create(@Body() data: AuthDto) {
		return this.authService.execute(data);
	}
}
