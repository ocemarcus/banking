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
         example: '12345',
         description: 'ID data conta befeficiária'
    })
     accountDestinationId: string

     @IsNumberString()
    @ApiProperty({
         example: '134567',
         description: 'Id da conta que sera enviado a tranferência'
    })
     accountOriginId: string
}