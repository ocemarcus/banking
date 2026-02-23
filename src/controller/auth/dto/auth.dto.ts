import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class AuthDto {
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