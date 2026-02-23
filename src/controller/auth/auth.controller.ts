import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "@service/auth/auth.service";
import { AuthDoc } from "./doc/auth.doc";
import { AuthDto } from "./dto/auth.dto";

@Controller("/auth")
@AuthDoc.Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@AuthDoc.create()
	async create(@Body() data: AuthDto) {
		return this.authService.execute(data);
	}
}
