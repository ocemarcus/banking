import { ApiProperty } from "@nestjs/swagger";
import { IsCpfCnpj } from "@validator/cpf-cnpj.validator";
import { IsEmail, IsNumberString, IsString } from "class-validator";

export class UsersDto {

    @IsString()
    @ApiProperty({
        example: 'Jose Da Silva'
    })
    fullName: string

    @IsNumberString()
    @ApiProperty({
        example: '313333333'
    })
    cellPhone: string

    @IsNumberString()
    @IsCpfCnpj()
    @ApiProperty({
        example: '16245987067',
        description: 'CPF/CNPJ do usuário'
    })
    document: string

    @IsEmail()
    @ApiProperty({
        example: 'jose@gmail.com'
    })
    email: string

    @IsString()
    @ApiProperty({
        example: '323232'
    })
    password: string

}