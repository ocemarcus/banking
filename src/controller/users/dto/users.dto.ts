import { IsEmail, IsNumberString, IsString } from "class-validator";

export class UsersDto {

    @IsString()
    fullName: string

    @IsNumberString()
    phone: string

    @IsNumberString()
    document: string

    @IsEmail()
    email: string

    @IsString()
    password: string

}