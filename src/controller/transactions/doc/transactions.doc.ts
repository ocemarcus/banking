import { createSwaggerProperties, SwaggerHttpResponse, swaggerType } from "@share/swagger"


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
        
    }
}

export const TransactionsSwaggerResponse = SwaggerHttpResponse(
    TransactionsSwaggerProperties,
    'Listar transações da conta'
)