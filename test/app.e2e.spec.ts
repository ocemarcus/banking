import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import request from "supertest";
import { App } from "supertest/types";
import { beforeEach, describe, it } from "vitest";

describe("AppModule (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [],
			providers: []
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();


	});

	it("Validar autenticação nas transações", async () => {
		 
		return request(app.getHttpServer())
			.get("/transactions")
			.expect(401)
	});
});
