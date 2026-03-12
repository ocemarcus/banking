import { TransactionsDto } from "@cqrs/transactions/interfaces/dto/transactions.dto";


export class TransactionsQueryCommand {
    constructor(
        public userId: string,
        public params: TransactionsDto
    ) {}
}