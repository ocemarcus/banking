import { Type } from "class-transformer";
import { IsNumberString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { TransactionsDto } from "./transations.dto";

export class TransactionsOwnerDto {
	@IsString()
	fullName: string;

	@IsNumberString()
	document: string;

	@IsString()
	cellPhone: string

	@IsString()
	bankName: string;

	@IsString()
	bankAccount: string;
}

export class CreateTransactionsDto extends TransactionsDto {
	@ValidateNested()
	@Type(() => TransactionsOwnerDto)
	owner: TransactionsOwnerDto;

	@IsUUID()
	@IsOptional()
	accountFromId: string
}
