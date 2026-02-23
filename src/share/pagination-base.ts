import { ApiProperty } from "@nestjs/swagger";
import {
	IsISO8601,
	IsNumberString,
	IsOptional,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "pagination", async: false })
export class Pagination implements ValidatorConstraintInterface {
	validate(page: string, args: any) {
		page = ((+page - 1) * +args.object["limit"]).toString();
		args.object["page"] = page;
		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return "";
	}
}

export class PaginationBase {
	@IsNumberString()
	@ApiProperty({
		example: '10',
		type: 'number',
		description: 'Limite de paginas'
	})
	limit = "10";

	@Validate(Pagination)
	@ApiProperty({
		example: '1',
		description: 'Página'
	})
	page: string;

	@IsOptional()
	@IsISO8601()
	@ApiProperty({
		example: '2026-01-01',
		description: 'Data inicial padrão ISO8601'
	})
	startDate?: string;

	@IsOptional()
	@IsISO8601()
	@ApiProperty({
		example: '2026-01-30',
		description: 'Data final padrão ISO8601'
	})
	endDate?: string;
}
