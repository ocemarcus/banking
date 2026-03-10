import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString } from "class-validator";


export class    P2PTransactionsDto {

    @IsNumber()
    @ApiProperty({
         example: 1000,
         description: 'Valor da transferência'
    })
    amount: number

     @IsNumberString()
    @ApiProperty({
         example: '019c8a95-43e4-7797-88e6-67f00573ea54',
         description: 'ID data conta befeficiária'
    })
     accountDestinationId: string

     @IsNumberString()
    @ApiProperty({
         example: '019c8a95-43e4-7797-88e6-67f00573ea54',
         description: 'Id da conta que sera enviado a tranferência'
    })
    accountId: string
}