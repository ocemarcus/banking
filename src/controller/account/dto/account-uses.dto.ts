import { IsEnum, IsUUID } from "class-validator";

export class CreateAccountDto {

    @IsEnum(['pf', 'pj'])
    accountType: string

    @IsUUID()
    userId: string

}