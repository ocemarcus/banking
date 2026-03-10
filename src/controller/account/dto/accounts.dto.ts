import { IsNumberString, IsOptional } from "class-validator";


export class AccountsDto {
    @IsNumberString()
    @IsOptional()
    document: string
}