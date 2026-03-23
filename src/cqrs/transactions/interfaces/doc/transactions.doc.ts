import { createSwaggerProperties, SwaggerPaginationResponse, swaggerType } from "@share/swagger"


export const TransactionsOwnerProperties = {
      fullName:createSwaggerProperties(swaggerType.string, 'Nome', 'Jose Da Silva'),
      document:createSwaggerProperties(swaggerType.string, 'CPF/CNPJ', '11443424'),
      bankName:createSwaggerProperties(swaggerType.string, 'Nome do banco','Itaú' ),
      bankAccount:createSwaggerProperties(swaggerType.string, 'Número da conta','121243'),

}


export const TransactionsSwaggerProperties = {
    id: createSwaggerProperties(swaggerType.string, 'Id da transação', 'uuid'),

    amount: createSwaggerProperties(swaggerType.number, 'Valor da transação em centavos', 100),

    credit: {
        type: swaggerType.object,
        properties: TransactionsOwnerProperties
        
    },
    debit: {
        type: swaggerType.object,
        properties: TransactionsOwnerProperties
        
    },
    createdAt: createSwaggerProperties(swaggerType.string, 'Data de criação', '2026-02-23 13:02:33.79405+00'),
    updatedAt: createSwaggerProperties(swaggerType.string, 'Data de atualização', '2026-02-23 13:02:33.79405+00'),
}

export const TransactionsSwaggerResponse = SwaggerPaginationResponse(
    TransactionsSwaggerProperties,
    'Listar transações da conta'
)