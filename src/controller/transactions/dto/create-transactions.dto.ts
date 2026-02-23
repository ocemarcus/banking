import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsNumber,
	IsNumberString,
	IsString,
	ValidateNested
} from "class-validator";

export class TransactionsOwnerDto {
	@IsString()
	@ApiProperty({
		example: "Jose Carlos",
		description: "Nome do usuário que está enviando a transação",
	})
	fullName: string;

	@IsNumberString()
	@ApiProperty({
		example: "16245987067",
		description: "CPF/CNPJ do usuário que está enviando",
	})
	document: string;

	@IsString()
	@ApiProperty({
		example: "3199999999",
		description: "Telefone do usuário que está enviando",
	})
	cellPhone: string;

	@IsString()
	@ApiProperty({
		example: "Itaú",
		description: "Nome do banco",
	})
	bankName: string;

	@IsString()
	@ApiProperty({
		example: "1124432132",
		description: "Número da conta que está enviando",
	})
	bankAccount: string;
}


export class CreateTransactionsDto {

	@IsNumber()
	@ApiProperty({
		example: 1000,
		description: 'Valor da transação em centavos'
	})
	amount: number

	@IsNumberString()
	@ApiProperty({
		description: 'Número da conta a ser enviada',
		example: 'uuidAccount'
	})
	accountNumber: string

	@ValidateNested()
	@Type(() => TransactionsOwnerDto)
	@ApiProperty({
		description: 'Dono da transação'
	})
	owner: TransactionsOwnerDto;


}
