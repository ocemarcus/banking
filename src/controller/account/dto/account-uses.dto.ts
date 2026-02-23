import { IsEnum, IsNumberString, IsUUID } from "class-validator";

export class CreateAccountDto {

    @IsEnum(['pf', 'pj'])
    accountType: string

    @IsUUID()
    userId: string

    @IsNumberString()
    document: string

}