import { TransactionsDto } from "@controller/transactions/dto/transations.dto";


export class TransactionsQueryCommand {
    constructor(
        public userId: string,
        public params: TransactionsDto
    ) {}
}