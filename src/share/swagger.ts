import { HttpStatus } from "@nestjs/common";

export enum swaggerType {
	string = "string",
	array = "array",
	object = "object",
	number = "number",
	query = "query",
	path = "path",
	boolean = "boolean",
	enum = "string",
}
export const createSwaggerProperties = (
	type: string,
	description: string,
	value?: any,
) => {
	return {
		type,
		description,
		default: value,
	};
};

export const createSwaggerPropertiesEnum = (
	description: string,
	value?: any,
	example?: any,
) => {
	return {
		example,
		description,
		enum: value,
		type: "string",
	};
};

export const createSwaggerParameters = (
	type: string,
	name: string,
	description: string,
	options?: any,
) => {
	return {
		in: type,
		name,
		description,
		schema: {
			type: options?.schema?.type ?? swaggerType.string,
			format: options?.schema?.format,
			default: options?.schema?.default,
		},
		required: type === swaggerType.path ? true : (options?.required ?? false),
	};
};
export const SwaggerHttpResponse = (properties: any, description: string) => {
	return {
		description, 
		status: HttpStatus.OK,
		content: {
				'application/json': {
					schema: {
					type: swaggerType.object,
					properties: {
						page: createSwaggerProperties(swaggerType.number, "Pagína atual", 1),
						total: createSwaggerProperties(
							swaggerType.number,
							"Quantidade de itens",
							1,
						),
						data: {
							type: swaggerType.array,
							items: {
								properties,
								type: swaggerType.object,
							},
						},
					}
				  }
				}
			}
	};
};

export const swaggerError = {
	statusCode: createSwaggerProperties(
		swaggerType.number,
		"Status da requisião",
		400,
	),
	error: createSwaggerProperties(
		swaggerType.string,
		"Tipo de error",
		"Bad Request",
	),
	message: createSwaggerProperties(
		swaggerType.string,
		"Mensagem do error",
		"Invalid Request",
	),
};
export const SwaggerError400 = {
	status: HttpStatus.BAD_REQUEST,
	description: "Error na requisição",
	content: {
		"application/json": {
			schema: {
				type: swaggerType.object,
				properties: {
					statusCode: createSwaggerProperties(
						swaggerType.number,
						"Status da requisição",
						HttpStatus.BAD_REQUEST,
					),
					error: createSwaggerProperties(
						swaggerType.string,
						"Tipo de error",
						"ERRO",
					),
					message: createSwaggerProperties(
						swaggerType.string,
						"Mensagem do error",
						"Valor inválido",
					),
				},
			},
		},
	},
};
export const SwaggerError401 = {
	status: HttpStatus.UNAUTHORIZED,
	description: "Error na autorização",
	content: {
		"application/json": {
			schema: {
				type: swaggerType.object,
				properties: {
					statusCode: createSwaggerProperties(
						swaggerType.number,
						"Status da requisião",
						HttpStatus.UNAUTHORIZED,
					),
					error: createSwaggerProperties(
						swaggerType.string,
						"Tipo de error",
						"Unauthorized",
					),
					message: createSwaggerProperties(
						swaggerType.string,
						"Mensagem do error",
						"Unauthorized",
					),
				},
			},
		},
	},
};

export const securitySwagger = [
	{
		bearerAuth: [],
	},
];
