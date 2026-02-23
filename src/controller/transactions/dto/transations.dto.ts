import { IsEnum, IsNumber, IsNumberString } from "class-validator";

export class TransactionsDto {
    @IsEnum([
    "pixIn",
	"pixOut",
	"bankSplitIn",
	"bankSplitOut",
	"transferInternalIn",
	"transferInternalOut",
    ])
    typeTransaction: string

    @IsNumber()
    amount: number

    @IsNumberString()
    accountNumber: string


}