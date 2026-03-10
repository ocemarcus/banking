import { ApiProperty } from "@nestjs/swagger";
import {
	IsISO8601,
	IsNumberString,
	IsOptional,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from "class-validator";
import moment from "moment";

@ValidatorConstraint({ name: "pagination", async: true })
export class Pagination implements ValidatorConstraintInterface {
	validate(page: string, args: any) {
		page = ((+page - 1) * +args.object["limit"]).toString();
		args.object["page"] = +page;

		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return "";
	}
}


export class PaginationBase {
	@IsNumberString()
	@IsOptional()
	@ApiProperty({
		example: '10',
		type: 'number',
		description: 'Limite de paginas'
	})
	limit = '10';

	@Validate(Pagination)
	@ApiProperty({
		example: '1',
		description: 'Página'
	})
	page: number;

	@IsOptional()
	@IsISO8601()
	@ApiProperty({
		example: moment().format('YYYY-MM-DD'),
		description: 'Data inicial padrão ISO8601'
	})
	startDate?: string;

	@IsOptional()
	@IsISO8601()
	@ApiProperty({
		description: 'Data final padrão ISO8601',
		example: moment().add(1, 'day').format('YYYY-MM-DD'),
	})
	endDate?: string;
}
