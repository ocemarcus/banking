import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsUUID } from "class-validator";

export class CreateAccountDto {

    @IsEnum(['pf', 'pj'])
    @ApiProperty({
        enum: ['pf', 'pj'],
        description: 'Tipo de conta',
        example: 'pf',
    })
    accountType: string

    @IsUUID()
    @ApiProperty({
        example: '019c8a95-43e4-7797-88e6-67f00573ea54',
        description: 'Id do usuário'
    })
    userId: string

    @IsNumberString()
    @ApiProperty({
        example: '11',
        description: 'Número da conta. Informar PCF/CNPJ 16245987067'
    })
    document: string

}