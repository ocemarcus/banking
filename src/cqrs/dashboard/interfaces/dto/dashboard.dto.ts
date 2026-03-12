import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsOptional } from "class-validator";
import moment from "moment";


export class DashboardDto  {


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