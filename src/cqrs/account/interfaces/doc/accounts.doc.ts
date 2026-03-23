import { createSwaggerProperties, createSwaggerPropertiesEnum, SwaggerPaginationResponse, swaggerType } from "@share/swagger";


export const AccountSwaggerProperties = {
    id: createSwaggerProperties(swaggerType.string, 'Id da transação', '6942348337294773741'),
    balance: createSwaggerProperties(
        swaggerType.number,
        'Saldo em conta. Valor em centavos',
        1000
    ),
    version: createSwaggerProperties(
        swaggerType.number,
        'Versao da conta',
        1
    ),
    accountNumber: createSwaggerProperties(swaggerType.string, 'Número da conta', '16245987067'),
    accountType: createSwaggerPropertiesEnum('Tipo de conta', ['pf','pj']),

    createdAt: createSwaggerProperties(swaggerType.string, 'Data de criação', '2026-02-23 13:02:33.79405+00'),
    updatedAt: createSwaggerProperties(swaggerType.string, 'Data de atualização', '2026-02-23 13:02:33.79405+00'),
}

export const AccountSwaggerResponse = SwaggerPaginationResponse(AccountSwaggerProperties, 'Listar contas')