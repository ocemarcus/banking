import { TransactionsDto } from "@controller/transactions/dto/transations.dto";
import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "@repository/transactions.repository";


@Injectable()
export class TransactionsService {

    constructor(
		private readonly transactionsRepository: TransactionsRepository,
	) {}

    public async execute(params: TransactionsDto, userId: string) {
        return await this.transactionsRepository.find(params, userId)
    }
}