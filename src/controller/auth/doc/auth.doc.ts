import { createSwaggerProperties, SwaggerResponse, swaggerType } from "@share/swagger"


export const AuthSwaggerProperties = {
    id: createSwaggerProperties(swaggerType.string, 'Id do usuário', 'bigint'),
    createdAt: createSwaggerProperties(swaggerType.string, 'Data de criação', '2026-02-23 13:02:33.79405+00'),
    updatedAt: createSwaggerProperties(swaggerType.string, 'Data de atualização', '2026-02-23 13:02:33.79405+00'),
}

export const AuthSwaggerResponse = SwaggerResponse	({
		id: createSwaggerProperties(swaggerType.string, "Id do usuário", "6942348337294773741"),
		tenantId: createSwaggerProperties(swaggerType.string, "Tenant da conta", "6942348337294773741"),
		fullName: createSwaggerProperties(swaggerType.string, "Nome do usário", "Jose Da Silva"),
		email: createSwaggerProperties(swaggerType.string, "Email do usário", "jose@gmail.com"),
		cellPhone: createSwaggerProperties(swaggerType.string, "Telefone celunar", "313333333"),
		document: createSwaggerProperties(swaggerType.string, "CPF/CNPJ do usuário", "16245987067"),
		token: createSwaggerProperties(swaggerType.string, "Token JWT", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"),
	}, 'Listar informações do usuário autenticado')