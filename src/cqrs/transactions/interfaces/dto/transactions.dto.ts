import { ApiProperty } from "@nestjs/swagger";
import { PaginationBase } from "@share/pagination-base";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";

export class TransactionsDto extends PaginationBase {
    @IsEnum([
    "pixIn",
	"pixOut",
	"bankSplitIn",
	"bankSplitOut",
	"transferInternalIn",
	"transferInternalOut",
    ])
    @ApiProperty({
        enum: [
            "pixIn",
            "bankSplitIn",
            "transferInternalIn",
            "transferInternalOut",
        ],
        description: 'Tipo da transação',
        required: false
    })
    @IsOptional()
    typeTransaction: string


    @IsNumberString()
    @IsOptional()
    @ApiProperty({
        description: 'Número da conta a ser enviada',
        required: false
    })
    accountNumber: string


}