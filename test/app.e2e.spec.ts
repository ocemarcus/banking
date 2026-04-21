import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { afterEach } from "node:test";
import { AppModule } from "src/app.module";
import { ValidationPipe } from "src/pipe/validate.pipe";
import request from "supertest";
import { App } from "supertest/types";
import { beforeEach, describe, it } from "vitest";

describe("AppModule (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();
	});

	afterEach(async () => await app.close());

	it("Validar autenticação nas transações", async () => {
		const payload = {
			fullName: "Jose Da Silva",
			cellPhone: "313333333",
			document: "162459870671",
			email: "jose@gmail.com",
			password: "323232",
		};

		const response = await request(app.getHttpServer())
			.post("/users")
			.send(payload);

		console.log(response.body);
	});
});
