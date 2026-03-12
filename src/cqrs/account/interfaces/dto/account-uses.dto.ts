import { ApiProperty } from "@nestjs/swagger";
import { IsCpfCnpj } from "@validator/cpf-cnpj.validator";
import { IsEnum, IsNumberString } from "class-validator";

export class CreateAccountDto {

    @IsEnum(['pf', 'pj'])
    @ApiProperty({
        enum: ['pf', 'pj'],
        description: 'Tipo de conta',
        example: 'pf',
    })
    accountType: string

    @IsNumberString()
    @IsCpfCnpj()
    @ApiProperty({
        example: '16245987067',
        description: 'Número da conta. Informar PCF/CNPJ'
    })
    document: string

}